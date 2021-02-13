import {initDependencies, iocContainer} from "../../../../src/inversify/inversify.config";
import {HubService} from "../../../../src/modules/hub/services/HubService";
import jwt from "jsonwebtoken";
import {v4 as uuidv4} from 'uuid';

import path from "path";
import util from "util";
import fs from "fs";
import {Tenants} from "../../../../src/modules/default/model/Tenants";
import {ResidentialProposalService} from "../../../../src/modules/residentialProposal/services/ResidentialProposalService";
import {generate} from "gerador-validador-cpf";
import {ParameterStore} from "../../../../src/configs/ParameterStore";

const readFile = util.promisify(fs.readFile)
const sign = util.promisify(jwt.sign)

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


describe("HubService Consulta proposta residencial", () => {

    let hubService: HubService
    let residentialProposalService: ResidentialProposalService
    let parameterStore: ParameterStore
    let customerIdResidential: string
    let paymentIdResidential: string

    beforeAll(async () => {
        hubService = iocContainer.get("HubService")
        parameterStore = iocContainer.get("ParameterStore")
        residentialProposalService = iocContainer.get("ResidentialProposalService")

        customerIdResidential = uuidv4(v4options)
        paymentIdResidential = uuidv4(v4options)

        const payment = await readFile(path.resolve(__dirname, "../../../fixtures/residentialNotification.json"), "utf-8")
        const secret = await parameterStore.getSecretValue("CALINDRA_JWT_SECRET")
        const paymentObject = JSON.parse(payment)
        paymentObject.id = customerIdResidential
        paymentObject.attributes.customPayload.proposal.cpf = generate()
        paymentObject.attributes.customPayload.proposal.customerId = paymentIdResidential
        const signedPayment = await sign(paymentObject, secret)
        const proposalProtocol = await residentialProposalService.processProposal(signedPayment)
        await residentialProposalService.saveSoldProposal(paymentObject, proposalProtocol, Tenants.RESIDENTIAL)
    })

    it("Busca um determinado plano comprado", async () => {
        const customerPlans = await hubService.retrievePlans(customerIdResidential)
        let thePlan: any
        if (customerPlans.residentialPlans?.length) {
            thePlan = customerPlans.residentialPlans.find(x => x.order === paymentIdResidential)
        }
        console.log(`PaymentID:${paymentIdResidential}, planOrder:${thePlan?.order}`)
        expect(thePlan).toBeDefined()
    })

    afterAll(async () => {
        await hubService.deleteOrderFromCustomer(customerIdResidential, paymentIdResidential)
        iocContainer.unbindAll()
    })

})
