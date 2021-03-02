import {initDependencies, iocContainer} from "../../../../src/inversify/inversify.config";
import { SmartphoneProposalMailService } from "../../../../src/modules/smartphoneProposal/services/SmartphoneProposalMailService";
import { DataToSendMail } from "../../../../src/modules/smartphoneProposal/model/DataToSendMail";

initDependencies()

jest.setTimeout(3000)

describe("SmartphoneProposalMail", () => {

    let smartphoneProposalMailService: SmartphoneProposalMailService

    beforeAll(async () => {
        smartphoneProposalMailService = iocContainer.get("SmartphoneProposalMailService")
    })

    it("Envia o e-mail para o segurado", async () => {
        const pass = 'e37d5ec8-36b9-4391-8d41-d98cdb98aa43'
        const proposalEmail = await smartphoneProposalMailService.sendSellingEmail(pass, true)
        expect(proposalEmail).toEqual(true) 
    })

})