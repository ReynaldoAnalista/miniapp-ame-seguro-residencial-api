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
        const mailInfo = await readFile(path.resolve(__dirname, "../../../fixtures/smartphoneNotification.json"), "utf-8")       
        const JsonMailInfo = JSON.parse(mailInfo)
        console.log(JsonMailInfo);
        //TODO: Terminar a implementação dos testes
        
        // const proposalEmail = await smartphoneProposalMailService.sendSellingEmail('bikil78950@dxecig.com', JsonMailInfo)        
        // console.log('EmailSent', proposalEmail);        
        // expect(proposalResponse.success).toEqual(true)
    })

})
