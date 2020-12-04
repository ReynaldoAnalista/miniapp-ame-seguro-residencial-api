import {initDependencies, iocContainer} from "../../../../src/inversify/inversify.config";
import {PlanRepository} from "../../../../src/modules/plan/repository/PlanRepository";
import {PlanService} from "../../../../src/modules/plan/services/PlanService";
import {ParameterStore} from "../../../../src/configs/ParameterStore";
import jwt from "jsonwebtoken";

import path from "path";
import util from "util";
import fs from "fs";
import nock from 'nock'
import Axios from "axios";

import {RequestService} from "../../../../src/modules/authToken/services/RequestService";

const readFile = util.promisify(fs.readFile)
const sign = util.promisify(jwt.sign)

const BASE_URL = 'http://localhost:8080/v1/zipcode'

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

    // it.only("Recebe o plano e mocka previsul", async () => {
    //     const protocolNumber = '1367123'
    //     nock("http://gateway.b2skyhmg.com")
    //         .post("/hub-previsul/residencial/propostas")
    //         .reply(200, {id: '2323', protocol: protocolNumber})
    //         .persist()
    //     nock("http://gateway.b2skyhmg.com")
    //         .post("/hub-previsul/oauth/token")
    //         .reply(200, {access_token: '123'})
    //         .persist()
    //
    //     const payment = await readFile(path.resolve(__dirname, "../../../fixtures/notification.json"), "utf-8")
    //     console.log("payment: " + payment)
    //     let signedPayment = await sign(JSON.parse(payment), await parameterStore.getSecretValue("CALINDRA_JWT_SECRET"))
    //     console.log("SignedPayment: " + signedPayment)
    //     const proposalProtocol = await planService.sendProposal({signedPayment})
    //     expect(proposalProtocol.protocol).toBe(protocolNumber)
    // })

    it("Recebe o plano e envia para a previsul", async () => {
        const payment = await readFile(path.resolve(__dirname, "../../../fixtures/notification.json"), "utf-8")
        console.log('Leu o arquivo de callback')
        const secret = await parameterStore.getSecretValue("CALINDRA_JWT_SECRET")
        console.log('Buscou o secret na AWS')
        const paymentObject = JSON.parse(payment)
        console.log('Realizou o parse do arquivo de callback')
        const signedPayment = await sign(paymentObject, secret)
        console.log('Descriptografou o arquivo de callback')
        const proposalProtocol = await planService.sendProposal({signedPayment})
        console.log('Enviou a proposta para a previsul')
        expect(proposalProtocol.protocolo).toBeDefined()
    })

     it.only("Validando o Cep ", async () => {
        const cep = "30000-000"

         let response = await Axios.get(`${BASE_URL}/${cep}`, {
                headers: {
                Accept: 'application/json'
            },
        }).then(res => res.data).catch(err => err)

        expect(response).toBe(true);
    })


})
