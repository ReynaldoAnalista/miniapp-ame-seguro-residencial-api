import path from "path"
import util from "util"
import fs from "fs"
import jwt from "jsonwebtoken"
import { v4 as uuidv4 } from "uuid"
import { initDependencies, iocContainer } from "../../../../src/inversify/inversify.config"
import { LifeProposalService } from "../../../../src/modules/lifeProposal/services/LifeProposalService"
import { ParameterStore } from "../../../../src/configs/ParameterStore"

const readFile = util.promisify(fs.readFile)
const sign = util.promisify(jwt.sign)

initDependencies()
jest.setTimeout(20000)

let lifeProposalService: LifeProposalService
describe("PetProposalService", () => {
    let parameterStore: ParameterStore
    let signedPayment: any

    beforeAll(async () => {
        lifeProposalService = iocContainer.get("LifeProposalService")
        // parameterStore = iocContainer.get("ParameterStore")
        // const payment = await readFile(path.resolve(__dirname, "../../../fixtures/petNotification.json"), "utf-8")
        // console.log('Leu o arquivo de callback')
        // const secret = await parameterStore.getSecretValue("CALINDRA_JWT_SECRET")
        // console.log('Buscou o secret na AWS')
        // const paymentObject = JSON.parse(payment)
        // console.log('Realizou o parse do arquivo de callback')
        // paymentObject.id = uuidv4()
        // paymentObject.attributes.customPayload.customerId = uuidv4()
        // signedPayment = await sign(paymentObject, secret)
    })

    it("Envio da validação do seguro de Vida", async () => {
        const lifeService = await lifeProposalService.getProposalModel()
        expect(lifeService).toBeDefined()
    })
})
