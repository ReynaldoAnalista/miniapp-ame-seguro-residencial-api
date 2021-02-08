import {initDependencies, iocContainer} from "../../../../src/inversify/inversify.config";
import {SmartphoneProposalService} from "../../../../src/modules/smartphoneProposal/services/SmartphoneProposalService";
import jwt from "jsonwebtoken";

import path from "path";
import util from "util";
import fs from "fs";

const readFile = util.promisify(fs.readFile)
const sign = util.promisify(jwt.sign)

initDependencies()
jest.setTimeout(10000)

describe("PlanService", () => {

    let smartphoneProposalService: SmartphoneProposalService

    beforeAll(async () => {
        smartphoneProposalService = iocContainer.get("PlanService")
    })

    it("Recebe o plano e envia para a DigiBee", async () => {
        const payment = await readFile(path.resolve(__dirname, "../../../fixtures/notification.json"), "utf-8")
        console.log('Leu o arquivo de callback')
        const paymentObject = JSON.parse(payment)
        console.log('Realizou o parse do arquivo de callback')
        await smartphoneProposalService.saveProposal(paymentObject)
        console.log('Salvou o arquivo da proposta')
        const proposalResponse = await smartphoneProposalService.sendProposal(paymentObject)
        console.log('Enviou a proposta para a digibee')
        await smartphoneProposalService.saveProposalResponse(proposalResponse)
        console.log('Salvou a resposta da digibee')
        expect(proposalResponse).toBeDefined()
    })

})
