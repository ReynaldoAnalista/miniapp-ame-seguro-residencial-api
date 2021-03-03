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
        const pass = '321a1caf-1491-4c93-8569-46f11574c044';
        const emailId = await smartphoneProposalMailService.sendSellingEmail(pass, true)
        expect(emailId).toBeDefined()
    })
})