import path from "path"
import util from "util"
import fs from "fs"
import jwt from "jsonwebtoken"
import { v4 as uuidv4 } from "uuid"
import { initDependencies, iocContainer } from "../../../../src/inversify/inversify.config"
import { HealthCareProposalService } from "../../../../src/modules/healthCareProposal/services/healthCareProposalService"
import { ParameterStore } from "../../../../src/configs/ParameterStore"
import { generate } from "gerador-validador-cpf"

const readFile = util.promisify(fs.readFile)
const sign = util.promisify(jwt.sign)

initDependencies()
jest.setTimeout(20000)

describe("HealthCareProposalService", () => {
    let healthCareProposalService: HealthCareProposalService
    let parameterStore: ParameterStore
    let signedPayment: any

    beforeAll(async () => {
        healthCareProposalService = iocContainer.get("HealthCareProposalService")
        parameterStore = iocContainer.get("ParameterStore")
        const payment = await readFile(path.resolve(__dirname, "../../../fixtures/HealthCareNotification.json"), "utf-8")
        const secret = await parameterStore.getSecretValue("CALINDRA_JWT_SECRET")
        const paymentObject = JSON.parse(payment)
        paymentObject.attributes.customPayload.proposal.cpf = generate({ format: true })
        signedPayment = await sign(paymentObject, secret)
    })

    it("Teste Inicial de HealthCare", async () => {
        const proposalResponse = await healthCareProposalService.proposal(signedPayment)
        expect(proposalResponse).toBeDefined()
    })
})
