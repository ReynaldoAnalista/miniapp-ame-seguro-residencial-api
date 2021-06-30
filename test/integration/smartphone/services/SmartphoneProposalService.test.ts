import {initDependencies, iocContainer} from "../../../../src/inversify/inversify.config";
import {SmartphoneProposalService} from "../../../../src/modules/smartphoneProposal/services/SmartphoneProposalService";
import jwt from "jsonwebtoken";
import {v4 as uuidv4} from 'uuid';

import path from "path";
import util from "util";
import fs from "fs";
import {Tenants} from "../../../../src/modules/default/model/Tenants";
import {ParameterStore} from "../../../../src/configs/ParameterStore";
import { SmartphoneProposalRepository } from "../../../../src/modules/smartphoneProposal/repository/SmartphoneProposalRepository";

const readFile = util.promisify(fs.readFile)
const sign = util.promisify(jwt.sign)

initDependencies()
jest.setTimeout(20000)

describe("SmartphoneProposalService", () => {

    let smartphoneProposalService: SmartphoneProposalService
    let smartphoneProposalRepository: SmartphoneProposalRepository
    let parameterStore: ParameterStore
    let signedPayment: any


    beforeAll(async () => {
        smartphoneProposalService = iocContainer.get("SmartphoneProposalService")
        smartphoneProposalRepository = iocContainer.get("SmartphoneProposalRepository")
        parameterStore = iocContainer.get("ParameterStore")
        const payment = await readFile(path.resolve(__dirname, "../../../fixtures/smartphoneNotification.json"), "utf-8")
        console.log('Leu o arquivo de callback')
        const secret = await parameterStore.getSecretValue("CALINDRA_JWT_SECRET")
        console.log('Buscou o secret na AWS')
        const paymentObject = JSON.parse(payment)
        console.log('Realizou o parse do arquivo de callback')  
        paymentObject.id = uuidv4()
        paymentObject.attributes.customPayload.customerId = uuidv4()
        signedPayment = await sign(paymentObject, secret)
    })

    it("Recebe o plano e envia para a DigiBee", async () => {
        const proposalResponse = await smartphoneProposalService.processProposal(signedPayment)
        expect(proposalResponse.success).toEqual(true)
    })

    it("Atualização da proposta de crédito", async() => {
        const getProposal = await smartphoneProposalRepository.listProposal()
        const proposalId = getProposal[0].id
        const updateProposal =  await smartphoneProposalService.updateProposal(proposalId)
        expect(updateProposal).toBeDefined()
    })

    it("Envio de proposta para DigiBee", async() => {
        const getProposal = await smartphoneProposalRepository.listProposal()
        const proposalId = getProposal[0].id        
        const digibeeProposal = await smartphoneProposalService.sendProposal(proposalId)
        expect(digibeeProposal).toBeDefined()
    })

    it("API para cancelamento", async() => {
        let cancel = await readFile(path.resolve(__dirname, "../../../fixtures/SmartphoneCancel.json"), "utf-8")
        let cancelObject = JSON.parse(cancel)
        let cancelSecret = await parameterStore.getSecretValue("CALINDRA_JWT_SECRET")
        let signedCancelProcess = await sign(cancelObject, cancelSecret)
        const cancelProcess = await smartphoneProposalService.cancelationProcess(signedCancelProcess)
        expect(cancelProcess).toBeDefined()
    })

})
