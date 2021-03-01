import {initDependencies, iocContainer} from "../../../../src/inversify/inversify.config";
import {SmartphoneProposalMailService} from "../../../../src/modules/smartphoneProposal/services/SmartphoneProposalMailService";
import {DataToSendMail} from "../../../../src/modules/smartphoneProposal/model/DataToSendMail";

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
        const notification = await readFile(path.resolve(__dirname, "../../../fixtures/smartphoneNotification.json"), "utf-8")
        const parsedNotification = JSON.parse(notification)
        const JsonMailInfo = formatMailJsonParseInfo(parsedNotification.attributes?.customPayload?.proposal)
        const proposalEmail = await smartphoneProposalMailService.sendSellingEmail(parsedNotification.attributes.customPayload.clientEmail, JsonMailInfo)
        expect(proposalEmail).toBeDefined()
    })

})

function formatMailJsonParseInfo(proposal): DataToSendMail {

    if (!proposal) {
        throw "Not be able to send a email without proposal"
    }

    return {
        securityName: proposal.insured_data.insured_name,
        securityUserCpf: proposal.insured_data.cnpj_cpf,
        securityAddress: proposal.insured_data.address_data.street,
        securityAddressNumber: proposal.insured_data.address_data.number,
        securityAddressDistrict: proposal.insured_data.address_data.district,
        securityAddressCity: proposal.insured_data.address_data.city,
        securityAddressUf: proposal.insured_data.address_data.federal_unit,
        securityDataUserCep: proposal.insured_data.address_data.zip_code,

        SecurityRepresentationSocialReazon: '-',
        SecurityRepresentationCnpj: '-',
        SecurityRepresentationCodSusep: '-',

        securityDataSocialReazon: '-',
        securityDataCpf: '-',

        brokerName: '-',
        brokerCodSusep: '-',

        securyDataBranch: '-',
        securyDataIndividualTicket: '-',
        securyDataEmissionDate: '-',
        securyDataInitialSuranceTerm: '-',
        securyDataFinalSuranceTerm: '-',

        maxLimitThieft: '-',
        posThieft: '-',
        prizeThieft: '-',
        lackThieft: '-',
        maxLimitAcidental: '-',
        posAcidental: '-',
        prizeAcidental: '-',
        lackAcidental: '-',
        productDescription: proposal.portable_equipment_risk_data.product_description,
        model: '-',
        mark: '-',
        paymentForm: proposal.operationType,
        liquidPrice: proposal.amount,
        iof: '-',
        totalPrize: '-'
    } as DataToSendMail
}