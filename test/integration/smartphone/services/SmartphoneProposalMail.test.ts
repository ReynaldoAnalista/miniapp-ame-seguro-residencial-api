import {initDependencies, iocContainer} from "../../../../src/inversify/inversify.config";
import { SmartphoneProposalMailService } from "../../../../src/modules/smartphoneProposal/services/SmartphoneProposalMailService";

initDependencies()

jest.setTimeout(30000)

describe("SmartphoneProposalMail", () => {
    let smartphoneProposalMailService: SmartphoneProposalMailService
    beforeAll(async () => {
        smartphoneProposalMailService = iocContainer.get("SmartphoneProposalMailService")
    }) 
    it("Envia o e-mail para o segurado", async () => {
        const pass = '49917e28-8d64-47f7-a280-93c28481eab9';
        const emailId = await smartphoneProposalMailService.sendSellingEmail(pass) 
        expect(emailId).toBeDefined()
    })
})