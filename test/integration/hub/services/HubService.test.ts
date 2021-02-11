import {initDependencies, iocContainer} from "../../../../src/inversify/inversify.config";
import {HubService} from "../../../../src/modules/hub/services/HubService";
import {SmartphoneProposalService} from "../../../../src/modules/smartphoneProposal/services/SmartphoneProposalService";
import jwt from "jsonwebtoken";
import {v4 as uuidv4} from 'uuid';

import path from "path";
import util from "util";
import fs from "fs";
import {Tenants} from "../../../../src/modules/default/model/Tenants";

const readFile = util.promisify(fs.readFile)
const sign = util.promisify(jwt.sign)

initDependencies()
jest.setTimeout(20000)


describe("HubService", () => {

    let hubService: HubService
    let smartphoneProposalService: SmartphoneProposalService
    let customerId: string
    let paymentId: string

    beforeAll(async () => {
        hubService = iocContainer.get("HubService")
        smartphoneProposalService = iocContainer.get("SmartphoneProposalService")

        customerId = uuidv4()
        paymentId = uuidv4()

        const payment = await readFile(path.resolve(__dirname, "../../../fixtures/smartphoneNotification.json"), "utf-8")
        const paymentObject = JSON.parse(payment)
        paymentObject.id = paymentId
        paymentObject.attributes.customPayload.customerId = customerId
        await smartphoneProposalService.saveProposal(paymentObject)
        const proposalResponse = await smartphoneProposalService.sendProposal(paymentObject)
        await smartphoneProposalService.saveProposalResponse(proposalResponse)
        await smartphoneProposalService.saveSoldProposal(paymentObject, proposalResponse, Tenants.SMARTPHONE)

    })

    it("Busca um determinado plano comprado", async () => {
        const customerPlans = await hubService.retrievePlans(customerId)
        let thePlan: any
        if(customerPlans.smartphonePlans?.length){
            thePlan = customerPlans.smartphonePlans.find(x => x.order === paymentId)
        }
        console.log(`PaymentID:${paymentId}, planOrder:${thePlan.order}`)
        expect(thePlan).toBeDefined()
    })

    afterAll(async () => {
        await hubService.deleteOrderFromCustomer(customerId, paymentId)
    })

})
