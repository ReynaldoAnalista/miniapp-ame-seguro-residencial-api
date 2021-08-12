import { initDependencies, iocContainer } from "../../../../src/inversify/inversify.config"
import { HubService } from "../../../../src/modules/hub/services/HubService"
import jwt from "jsonwebtoken"
import { v4 as uuidv4 } from "uuid"
import { AuthTokenService } from "../../../../src/modules/authToken/services/AuthTokenService"
import path from "path"
import util from "util"
import fs from "fs"
import { Tenants } from "../../../../src/modules/default/model/Tenants"
import { HealthCareProposalService } from "../../../../src/modules/healthCareProposal/services/healthCareProposalService"
import { generate } from "gerador-validador-cpf"
import { ParameterStore } from "../../../../src/configs/ParameterStore"
import moment from "moment"

const readFile = util.promisify(fs.readFile)
const sign = util.promisify(jwt.sign)

initDependencies()
jest.setTimeout(20000)

const v4options = {
    random: [0x10, 0x91, 0x56, 0xbe, 0xc4, 0xfb, 0xc1, 0xea, 0x71, 0xb4, 0xef, 0xe1, 0x67, 0x1c, 0x58, 0x36],
}

describe("HealthCareProposalService", () => {
    let healthCareProposalService: HealthCareProposalService
    let parameterStore: ParameterStore
    let signedPayment
    let authTokenService: AuthTokenService

    beforeAll(async () => {
        parameterStore = iocContainer.get("ParameterStore")
        healthCareProposalService = iocContainer.get("HealthCareProposalService")
        authTokenService = iocContainer.get("AuthTokenService")

        const payment = await readFile(path.resolve(__dirname, "../../../fixtures/HealthCareNotification.json"), "utf-8")
        const secret = await parameterStore.getSecretValue("CALINDRA_JWT_SECRET")

        const paymentObject = JSON.parse(payment)
        paymentObject.attributes.customPayload.proposal.cpf = generate({ format: false })
        signedPayment = await sign(paymentObject, secret)
    })

    it("Realiza a proposta do seguro mais saúde", async () => {
        const proposal = await healthCareProposalService.proposal(signedPayment)
        expect(proposal.success).toBe(true)
    })

    it("Realiza o cancelamento do seguro mais saúde", async () => {
        const unsignedPayment = await authTokenService.unsignNotification(signedPayment)
        const cancelProposal = {
            cpf: unsignedPayment.attributes.customPayload.proposal.cpf,
            order: unsignedPayment.id,
            customerId: unsignedPayment.attributes.customPayload.customerId,
        }
        const proposal = await healthCareProposalService.cancel(cancelProposal)
        expect(proposal.success).toBe(true)
    })

    // afterAll(async () => {
    //     await hubService.deleteOrderFromCustomer(customerIdResidential, paymentIdResidential)
    //     iocContainer.unbindAll()
    // })
})
