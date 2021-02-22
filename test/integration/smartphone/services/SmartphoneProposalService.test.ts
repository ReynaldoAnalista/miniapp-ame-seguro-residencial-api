import {initDependencies, iocContainer} from "../../../../src/inversify/inversify.config";
import {SmartphoneProposalService} from "../../../../src/modules/smartphoneProposal/services/SmartphoneProposalService";
import jwt from "jsonwebtoken";
import {v4 as uuidv4} from 'uuid';

import path from "path";
import util from "util";
import fs from "fs";
import {Tenants} from "../../../../src/modules/default/model/Tenants";
import {ParameterStore} from "../../../../src/configs/ParameterStore";

const readFile = util.promisify(fs.readFile)
const sign = util.promisify(jwt.sign)

initDependencies()
jest.setTimeout(20000)

describe("SmartphoneProposalService", () => {

    let smartphoneProposalService: SmartphoneProposalService
    let parameterStore: ParameterStore

    beforeAll(async () => {
        smartphoneProposalService = iocContainer.get("SmartphoneProposalService")
        parameterStore = iocContainer.get("ParameterStore")
    })

    it("Recebe o plano e envia para a DigiBee", async () => {
        const payment = await readFile(path.resolve(__dirname, "../../../fixtures/smartphoneNotification.json"), "utf-8")
        console.log('Leu o arquivo de callback')
        const secret = await parameterStore.getSecretValue("CALINDRA_JWT_SECRET")
        console.log('Buscou o secret na AWS')
        const paymentObject = JSON.parse(payment)
        console.log('Realizou o parse do arquivo de callback')
        paymentObject.id = uuidv4()
        paymentObject.attributes.customPayload.customerId = uuidv4()
        const signedPayment = await sign(paymentObject, secret)
        const proposalResponse = await smartphoneProposalService.processProposal(signedPayment)
        expect(proposalResponse.success).toEqual(true)
    })

})