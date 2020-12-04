import {initDependencies, iocContainer} from "../../../src/inversify/inversify.config";
import {PlanRepository} from "../../../src/modules/plan/repository/PlanRepository";
import {PlanService} from "../../../src/modules/plan/services/PlanService";
import {ParameterStore} from "../../../src/configs/ParameterStore";
import jwt from "jsonwebtoken";

import path from "path";
import util from "util";
import fs from "fs";
import nock from 'nock'

import {RequestService} from "../../../src/modules/authToken/services/RequestService";

const readFile = util.promisify(fs.readFile)
const sign = util.promisify(jwt.sign)

initDependencies()
jest.setTimeout(10000)

describe("PlanService", () => {

    let planRepository: PlanRepository
    let planService: PlanService
    let parameterStore: ParameterStore
    let requestService: RequestService

    beforeAll(async () => {
        planRepository = iocContainer.get("PlanRepository")
        planService = iocContainer.get("PlanService")
        parameterStore = iocContainer.get("ParameterStore")
        requestService = iocContainer.get("RequestService")
    })

    beforeEach(async () => {
        nock.cleanAll()
    })

    afterAll( async () => {
        nock.cleanAll()
        iocContainer.unbindAll()
    })

    it("Assinando e desassinando o pagamento", async () => {
        const payment = await readFile(path.resolve(__dirname, "../../fixtures/notification.json"), "utf-8")
        console.log('Leu o arquivo de callback')
        const secret = await parameterStore.getSecretValue("CALINDRA_JWT_SECRET")
        console.log('Buscou o secret na AWS')
        const paymentObject = JSON.parse(payment)
        console.log('Realizou o parse do arquivo de callback')
        const signedPayment = await sign(paymentObject, secret)
        console.log('Assinou o arquivo de callback')
        const unsignedPayment = await planService.unsignPayment(signedPayment)
        console.log('Enviou a proposta para a previsul')
        expect(unsignedPayment).toEqual(payment)
    })

})
