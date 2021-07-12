import path from "path"
import util from "util"
import fs from "fs"
import jwt from "jsonwebtoken"
import { v4 as uuidv4 } from "uuid"
import { initDependencies, iocContainer } from "../../../../src/inversify/inversify.config"
import { PetProposalService } from "../../../../src/modules/petProposal/services/PetProposalService"
import { ParameterStore } from "../../../../src/configs/ParameterStore"

const readFile = util.promisify(fs.readFile)
const sign = util.promisify(jwt.sign)

initDependencies()
jest.setTimeout(20000)

let petProposalService: PetProposalService
describe("PetProposalService", () => {
    let parameterStore: ParameterStore
    let signedPayment: any

    beforeAll(async () => {
        petProposalService = iocContainer.get("PetProposalService")
        parameterStore = iocContainer.get("ParameterStore")
        const payment = await readFile(path.resolve(__dirname, "../../../fixtures/petNotification.json"), "utf-8")
        console.log("Leu o arquivo de callback")
        const secret = await parameterStore.getSecretValue("CALINDRA_JWT_SECRET")
        console.log("Buscou o secret na AWS")
        const paymentObject = Object()
        paymentObject.attributes = JSON.parse(payment)
        console.log("Realizou o parse do arquivo de callback")
        paymentObject.attributes.id = uuidv4()
        signedPayment = await sign(paymentObject, secret)
    })

    it("Envio da requisição de Pet", async () => {
        const petService = await petProposalService.sendProposal(signedPayment)
        expect(petService?.data).toBe("Success")
    })
})
