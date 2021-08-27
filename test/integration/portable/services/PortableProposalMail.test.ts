import { initDependencies, iocContainer } from "../../../../src/inversify/inversify.config"
import { HubService } from "../../../../src/modules/hub/services/HubService"
import { PortableProposalRepository } from "../../../../src/modules/portableProposal/repository/PortableProposalRepository"
import { PortableProposalMailService } from "../../../../src/modules/portableProposal/services/PortableProposalMailService"
import { Tenants } from "../../../../src/modules/default/model/Tenants"
import { v4 as uuidv4 } from "uuid"

import path from "path"
import util from "util"
import fs from "fs"
import { PortableProposalService } from "../../../../src/modules/portableProposal/services/PortableProposalService"

const readFile = util.promisify(fs.readFile)

initDependencies()

jest.setTimeout(30000)

const v4options = {
    random: [0x10, 0x91, 0x56, 0xbe, 0xc4, 0xfb, 0xc1, 0xea, 0x71, 0xb4, 0xef, 0xe1, 0x67, 0x1c, 0x58, 0x36],
}

describe("PortableProposalMail", () => {
    let portableProposalMailService: PortableProposalMailService
    let portableProposalRepository: PortableProposalRepository

    let hubService: HubService
    let portableProposalService: PortableProposalService
    let customerIdPortable: string
    let paymentIdPortable: string

    beforeAll(async () => {
        portableProposalMailService = iocContainer.get("PortableProposalMailService")
        portableProposalRepository = iocContainer.get("PortableProposalRepository")
        hubService = iocContainer.get("HubService")
        portableProposalService = iocContainer.get("PortableProposalService")
        customerIdPortable = uuidv4(v4options)
        paymentIdPortable = uuidv4(v4options)
        const payment = await readFile(path.resolve(__dirname, "../../../fixtures/portableNotification.json"), "utf-8")
        const paymentObject = JSON.parse(payment)
        paymentObject.id = paymentIdPortable
        paymentObject.attributes.customPayload.customerId = customerIdPortable
        await portableProposalService.saveProposal(paymentObject)
        const proposalResponse = await portableProposalService.sendProposal(paymentObject)
        await portableProposalService.saveProposalResponse(proposalResponse, paymentObject.id)
        await portableProposalService.saveSoldProposal(paymentObject, proposalResponse, Tenants.PORTABLE)
    })

    it("Envia o e-mail para o segurado", async () => {
        const emailId = await portableProposalService.sendSellingEmail(customerIdPortable)
        expect(emailId).toBeDefined()
    })
})
