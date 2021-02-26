import {initDependencies, iocContainer} from "../../../../src/inversify/inversify.config";
import { SmartphoneProposalMailService } from "../../../../src/modules/smartphoneProposal/services/SmartphoneProposalMailService";

import path from "path";
import util from "util";
import fs from "fs";

initDependencies()

const readFile = util.promisify(fs.readFile)

jest.setTimeout(3000)

describe("SmartphoneProposalMail", () => {

    let smartphoneProposalMailService: SmartphoneProposalMailService

    beforeAll(async () => {
        smartphoneProposalMailService = iocContainer.get("SmartphoneProposalMailService")
    })

    it("Envia o e-mail para o segurado", async () => {
        // const mailInfo = await readFile(path.resolve(__dirname, "../../../fixtures/smartphoneNotification.json"), "utf-8")       
        // const JsonMailInfo = JSON.parse(mailInfo)
        const proposalEmail = await smartphoneProposalMailService.sendSellingEmail()  
        console.debug('POSTOP 11', proposalEmail)
        // expect(proposalResponse.success).toEqual(true)
    })

})
