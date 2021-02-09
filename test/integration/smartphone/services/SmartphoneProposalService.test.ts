import {initDependencies, iocContainer} from "../../../../src/inversify/inversify.config";
import {SmartphoneProposalService} from "../../../../src/modules/smartphoneProposal/services/SmartphoneProposalService";
import jwt from "jsonwebtoken";
import {v4 as uuidv4} from 'uuid';

import path from "path";
import util from "util";
import fs from "fs";

const readFile = util.promisify(fs.readFile)
const sign = util.promisify(jwt.sign)

initDependencies()
jest.setTimeout(20000)

describe("SmartphoneProposalService", () => {

    let smartphoneProposalService: SmartphoneProposalService

    beforeAll(async () => {
        smartphoneProposalService = iocContainer.get("SmartphoneProposalService")
    })

    it("Recebe o plano e envia para a DigiBee", async () => {
        const payment = await readFile(path.resolve(__dirname, "../../../fixtures/smartphoneNotification.json"), "utf-8")
        console.log('Leu o arquivo de callback')
        const paymentObject = JSON.parse(payment)
        console.log('Realizou o parse do arquivo de callback')
        paymentObject.id = uuidv4()
        paymentObject.attributes.customPayload.customerId = uuidv4()
        await smartphoneProposalService.saveProposal(paymentObject)
        console.log('Salvou o arquivo da proposta')
        const proposalResponse = await smartphoneProposalService.sendProposal(paymentObject)
        console.log('Enviou a proposta para a digibee')
        await smartphoneProposalService.saveProposalResponse(proposalResponse)
        console.log('Salvou a resposta da digibee')
        await smartphoneProposalService.saveSoldProposal(paymentObject, proposalResponse, SmartphoneProposalService.TENANT.SMARTPHONE)
        console.log('Salvou a compra')
        expect(proposalResponse.success).toEqual(true)
    })

})
