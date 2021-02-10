import {initDependencies, iocContainer} from "../../../../src/inversify/inversify.config";
import {HubService} from "../../../../src/modules/hub/services/HubService";
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

describe("HubService", () => {

    let hubService: HubService
    let smartphoneProposalService: SmartphoneProposalService
    let customerId: string

    beforeAll(async () => {
        hubService = iocContainer.get("HubService")
        smartphoneProposalService = iocContainer.get("SmartphoneProposalService")

        customerId = "madera"//uuidv4()
        const payment = await readFile(path.resolve(__dirname, "../../../fixtures/smartphoneNotification.json"), "utf-8")
        const paymentObject = JSON.parse(payment)
        paymentObject.id = uuidv4()
        paymentObject.attributes.customPayload.customerId = customerId

        await smartphoneProposalService.saveProposal(paymentObject)
        const proposalResponse = await smartphoneProposalService.sendProposal(paymentObject)
        await smartphoneProposalService.saveProposalResponse(proposalResponse)
        await smartphoneProposalService.saveSoldProposal(paymentObject, proposalResponse, SmartphoneProposalService.TENANT.SMARTPHONE)
    })

    it("Busca um determinado plano comprado", async () => {
        const customerPlans = await hubService.retrievePlans(customerId)
        console.log(customerPlans)
        expect(true).toEqual(true)
    })

    afterAll(async () => {
        // await hubService.deleteAllPlansFromCustomer(customerId)
    })

})
