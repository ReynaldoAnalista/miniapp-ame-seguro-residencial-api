import {initDependencies, iocContainer} from "../../../../src/inversify/inversify.config";
import { SmartphoneProposalMailService } from "../../../../src/modules/smartphoneProposal/services/SmartphoneProposalMailService";
import { DataToSendMail } from "../../../../src/modules/smartphoneProposal/model/DataToSendMail";

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
        const JsonMailInfo = formatMailJsonParseInfo(JSON.parse(mailInfo)) 
        console.log(JsonMailInfo);       
        const proposalEmail = await smartphoneProposalMailService.sendSellingEmail('arthur81301@mailfony.com', JsonMailInfo)        
        console.log('EmailSent', proposalEmail) 
        // expect(proposalResponse.success).toEqual(true)
    })

})

function formatMailJsonParseInfo(MailInfo) {

    const dataToSendMail: DataToSendMail = {
        securityName : MailInfo.attributes.customPayload.proposal.insured_data.insured_name,
        securityUserCpf : MailInfo.attributes.customPayload.proposal.insured_data.cnpj_cpf,
        securityAddress : MailInfo.attributes.customPayload.proposal.insured_data.address_data.street,
        securityAddressNumber: MailInfo.attributes.customPayload.proposal.insured_data.address_data.number,
        securityAddressDistrict: MailInfo.attributes.customPayload.proposal.insured_data.address_data.district,
        securityAddressCity: MailInfo.attributes.customPayload.proposal.insured_data.address_data.city,
        securityAddressUf: MailInfo.attributes.customPayload.proposal.insured_data.address_data.federal_unit,        
        securityDataUserCep: MailInfo.attributes.customPayload.proposal.insured_data.address_data.zip_code,

        SecurityRepresentationSocialReazon: '-',
        SecurityRepresentationCnpj: '-',
        SecurityRepresentationCodSusep: '-',

        securityDataSocialReazon: '-',
        securityDataCpf: '-',

        brokerName: '-',
        brokerCodSusep: '-',

        securyDataBranch: '-',
        securyDataIndividualTicket: '-',
        securyDataEmissionDate:  '-',
        securyDataInitialSuranceTerm:  '-',
        securyDataFinalSuranceTerm:  '-',        

        maxLimitThieft: '-',
        posThieft: '-',
        prizeThieft:  '-',
        lackThieft:  '-',    
        maxLimitAcidental:  '-',
        posAcidental:  '-', 
        prizeAcidental:  '-',
        lackAcidental:  '-',    
        productDescription:  MailInfo.attributes.customPayload.proposal.portable_equipment_risk_data.product_description,
        model: '-',
        mark: '-',        
        paymentForm: MailInfo.operationType,
        liquidPrice: MailInfo.amount,
        iof: '-',    
        totalPrize: '-'
    }

    return dataToSendMail;
}