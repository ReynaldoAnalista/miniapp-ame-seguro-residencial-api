import { initDependencies, iocContainer } from "../../../../src/inversify/inversify.config";
import { SmartphoneProposalMailService } from "../../../../src/modules/smartphoneProposal/services/SmartphoneProposalMailService";
import { SimpleEmail } from "../../../../src/modules/default/model/SimpleEmail";

initDependencies()

describe("MailSmtpService", () => {
    let mailService: SmartphoneProposalMailService
    beforeEach(() => {
        mailService = iocContainer.get("MailSmtpService")
    })
    it("Test Simple SMTP", async () => {
        let simpleEmail = {
            
        } as SimpleEmail
        await mailService.send(simpleEmail) 
    })
})