import {initDependencies, iocContainer} from "../../../../src/inversify/inversify.config";
import {HubService} from "../../../../src/modules/hub/services/HubService";
import {SmartphoneProposalService} from "../../../../src/modules/smartphoneProposal/services/SmartphoneProposalService";
import {v4 as uuidv4} from 'uuid';

import path from "path";
import util from "util";
import fs from "fs";
import {Tenants} from "../../../../src/modules/default/model/Tenants";

const readFile = util.promisify(fs.readFile)

initDependencies()
jest.setTimeout(20000)

const v4options = {
    random: [
        0x10,
        0x91,
        0x56,
        0xbe,
        0xc4,
        0xfb,
        0xc1,
        0xea,
        0x71,
        0xb4,
        0xef,
        0xe1,
        0x67,
        0x1c,
        0x58,
        0x36,
    ],
};


describe("HubService Consulta proposta smartphone", () => {

    let hubService: HubService
    let smartphoneProposalService: SmartphoneProposalService
    let customerIdSmartphone: string
    let paymentIdSmartphone: string

    beforeAll(async () => {
        hubService = iocContainer.get("HubService")
        smartphoneProposalService = iocContainer.get("SmartphoneProposalService")

        customerIdSmartphone = uuidv4(v4options)
        paymentIdSmartphone = uuidv4(v4options)

        const payment = await readFile(path.resolve(__dirname, "../../../fixtures/smartphoneNotification.json"), "utf-8")
        const paymentObject = JSON.parse(payment)
        paymentObject.id = paymentIdSmartphone
        paymentObject.attributes.customPayload.customerId = customerIdSmartphone
        await smartphoneProposalService.saveProposal(paymentObject)
        const proposalResponse = await smartphoneProposalService.sendProposal(paymentObject)
        await smartphoneProposalService.saveProposalResponse(proposalResponse)
        await smartphoneProposalService.saveSoldProposal(paymentObject, proposalResponse, Tenants.SMARTPHONE)

    })

    it("Busca um determinado plano comprado", async () => {
        const customerPlans = await hubService.retrievePlans(customerIdSmartphone)
        let thePlan: any
        if (customerPlans.smartphonePlans?.length) {
            thePlan = customerPlans.smartphonePlans.find(x => x.order === paymentIdSmartphone)
        }
        console.log(`PaymentID:${paymentIdSmartphone}, planOrder:${thePlan?.order}`)
        expect(thePlan).toBeDefined()
    })

    afterAll(async () => {
        await hubService.deleteOrderFromCustomer(customerIdSmartphone, paymentIdSmartphone)
        iocContainer.unbindAll()
    })

})
