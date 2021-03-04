import {initDependencies, iocContainer} from "../../../../src/inversify/inversify.config";
import { SmartphoneProposalRepository } from "../../../../src/modules/smartphoneProposal/repository/SmartphoneProposalRepository";
import { SmartphoneProposalMailService } from "../../../../src/modules/smartphoneProposal/services/SmartphoneProposalMailService";

initDependencies()

jest.setTimeout(30000)

describe("SmartphoneProposalMail", () => {
    let smartphoneProposalMailService: SmartphoneProposalMailService
    let smartphoneProposalRepository: SmartphoneProposalRepository
    beforeAll(async () => {
        smartphoneProposalMailService = iocContainer.get("SmartphoneProposalMailService")
        smartphoneProposalRepository = iocContainer.get("SmartphoneProposalRepository")
    }) 
    it("Envia o e-mail para o segurado", async () => {
        let getPass = await smartphoneProposalRepository.listProposal()
        let pass = getPass[0].id
        const emailId = await smartphoneProposalMailService.sendSellingEmail(pass) 
        expect(emailId).toBeDefined()
    })
})