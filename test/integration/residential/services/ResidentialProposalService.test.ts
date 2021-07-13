import { initDependencies, iocContainer } from "../../../../src/inversify/inversify.config"
import { ResidentialProposalRepository } from "../../../../src/modules/residentialProposal/repository/ResidentialProposalRepository"
import { ResidentialProposalService } from "../../../../src/modules/residentialProposal/services/ResidentialProposalService"
import { ParameterStore } from "../../../../src/configs/ParameterStore"
import jwt from "jsonwebtoken"
import { v4 as uuidv4 } from "uuid"
import { generate } from "gerador-validador-cpf"
import delay from "delay"

import path from "path"
import util from "util"
import fs from "fs"

import { RequestService } from "../../../../src/modules/authToken/services/RequestService"
import { ResidentialSoldProposalRepository } from "../../../../src/modules/residentialProposal/repository/ResidentialSoldProposalRepository"
import moment from "moment"
import Plans from "../../../../src/modules/residentialProposal/services/Plans"
import { getLogger } from "../../../../src/server/Logger"

const readFile = util.promisify(fs.readFile)
const sign = util.promisify(jwt.sign)

const log = getLogger("PetProposalService:test")

initDependencies()
jest.setTimeout(30000)

describe("ResidentialProposalService", () => {
    let residentialProposalRepository: ResidentialProposalRepository
    let residentialProposalService: ResidentialProposalService
    let residentialSoldProposalRepository: ResidentialSoldProposalRepository
    let parameterStore: ParameterStore
    let requestService: RequestService

    let customerId: string
    let orderId: string

    beforeAll(async () => {
        residentialProposalRepository = iocContainer.get("ResidentialProposalRepository")
        residentialProposalService = iocContainer.get("ResidentialProposalService")
        residentialSoldProposalRepository = iocContainer.get("ResidentialSoldProposalRepository")
        parameterStore = iocContainer.get("ParameterStore")
        requestService = iocContainer.get("RequestService")
        customerId = uuidv4()
        orderId = uuidv4()
    })

    it("Recebe todos os planos e envia pra Previsul", async () => {
        log.debug("Buscando todos os planos")
        const allPlans = Plans.map((x) => {
            return {
                id: x.id,
                descricao: x.descricao,
                premio: Number(x.premio.toString().replace(".", "")),
            }
        })
        const filterPlans = await Promise.all(
            allPlans.map(async (x) => {
                try {
                    await delay(2000)
                    return retrivePlanRequest(x.id, x.descricao, x.premio)
                } catch (ex) {
                    await delay(2000)
                    return { error: `Id do Plano: ${x.id} - Erro: ${ex}` }
                }
            })
        )

        const errorPlains = filterPlans.filter((x) => {
            return x.error
        })
        log.debug("Erros dos planos", errorPlains)
        expect(errorPlains.length).toBe(0)
    })

    afterAll(async () => {
        await residentialSoldProposalRepository.deleteByCustomerAndOrder(customerId, orderId)
        iocContainer.unbindAll()
    })

    async function retrivePlanRequest(planId = "117030111", descricaoPlano = "Proteção Essencial", premio = 14424) {
        try {
            const payment = await readFile(path.resolve(__dirname, "../../../fixtures/residentialNotification.json"), "utf-8")
            const secret = await parameterStore.getSecretValue("CALINDRA_JWT_SECRET")
            const paymentObject = JSON.parse(payment)
            paymentObject.id = orderId
            paymentObject.attributes.customPayload.proposal.cpf = generate()
            paymentObject.attributes.customPayload.proposal.customerId = customerId
            paymentObject.attributes.customPayload.proposal.dataInicioVigencia = moment().add(1, "d").format("YYYY-MM-DD")
            paymentObject.attributes.customPayload.proposal.pagamento.dataVencimento = moment().add(30, "d").format("YYYY-MM-DD")
            paymentObject.attributes.customPayload.proposal.planoId = planId
            paymentObject.description = descricaoPlano
            paymentObject.amount = premio
            const signedPayment = await sign(paymentObject, secret)
            const proposalProtocol = await residentialProposalService.processProposal(signedPayment)
            await delay(5000)
            if (typeof proposalProtocol == "undefined") {
                return { error: `erro no ID : ${planId}` }
            }
            return proposalProtocol
        } catch (err) {
            return err
        }
    }
})
