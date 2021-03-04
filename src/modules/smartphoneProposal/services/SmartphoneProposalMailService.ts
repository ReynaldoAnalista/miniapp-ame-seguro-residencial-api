import {inject, injectable} from "inversify";
import {SimpleEmail} from "../../default/model/SimpleEmail";
import fs from "fs";
import util from "util";
import path from "path";
import {DataToSendMail} from "../model/DataToSendMail";
import {SmartphoneProposalRepository} from '../repository/SmartphoneProposalRepository'
import EmailSender from "./EmailSender";
import {TYPES} from "../../../inversify/inversify.types";
import {ParameterStore} from "../../../configs/ParameterStore";
import {getLogger} from "../../../server/Logger";

const readFile = util.promisify(fs.readFile)
const log = getLogger("SmartphoneProposalMailService")

@injectable()
export class SmartphoneProposalMailService {

    constructor(
        @inject(TYPES.ParameterStore)
        private parameterStore: ParameterStore,
        @inject("SmartphoneProposalRepository")
        private smartphoneProposalRepository: SmartphoneProposalRepository,
    ) {
    }

    async sendSellingEmail(pass: string) {
        const paymentObject = await this.smartphoneProposalRepository.findByID(pass)
        if (!paymentObject) {
            throw "Order not found"
        }
        return await this.sendSellingEmailByPaymentObject(paymentObject)
    }

    async sendSellingEmailByPaymentObject(unsignedPayment: any) {        
        const email: string = unsignedPayment?.attributes?.customPayload?.clientEmail
        const dataToSendMail = await this.formatMailJsonParseInfo(unsignedPayment)
        let emailTemplate = path.resolve(__dirname, '../../../../mail_template/smartphone_mail.html')

        let template = await readFile(emailTemplate, 'utf-8')
        let body = template
        // DADOS DO USUARIO
            .replace(/@@secury_user_name@@/g, `${dataToSendMail.securityName}`)
            .replace(/@@secury_user_cpf@@/g, `${dataToSendMail.securityUserCpf}`)
            .replace(/@@secury_user_address@@/g, `${dataToSendMail.securityAddress}`)
            .replace(/@@secury_user_number@@/g, `${dataToSendMail.securityAddressNumber}`)
            .replace(/@@secury_user_district@@/g, `${dataToSendMail.securityAddressDistrict}`)
            .replace(/@@secury_user_city@@/g, `${dataToSendMail.securityAddressCity}`)
            .replace(/@@secury_user_cep@@/g, `${dataToSendMail.securityDataUserCep}`)
            .replace(/@@secury_user_uf@@/g, `${dataToSendMail.securityAddressUf}`)
            // DADOS DO REPRESENTANTE DO SEGURO
            .replace(/@@social_reazon@@/g, `${dataToSendMail.SecurityRepresentationSocialReazon}`)
            .replace(/@@cnpj@@/g, `${dataToSendMail.SecurityRepresentationCnpj}`)
            // DADOS DA SEGURADORA
            .replace(/@@secury_data_social_reazon@@/g, `${dataToSendMail.securityDataSocialReazon}`)
            .replace(/@@secury_data_cpf@@/g, `${dataToSendMail.securityDataCpf}`)
            // DADOS DO CORRETOR
            .replace(/@@broker_name@@/g, `${dataToSendMail.brokerName}`)
            .replace(/@@broker_susep@@/g, `${dataToSendMail.brokerCodSusep}`)
            // DADOS DO SEGURO
            .replace(/@@secury_data_branch@@/g, `${dataToSendMail.securyDataBranch}`)
            .replace(/@@secury_data_individual_ticket@@/g, `${dataToSendMail.securyDataIndividualTicket}`)
            .replace(/@@secury_data_emission_date@@/g, `${dataToSendMail.securyDataEmissionDate}`)
            .replace(/@@initial_surance_term@@/g, `${dataToSendMail.securyDataInitialSuranceTerm}`)
            .replace(/@@final_surance_term@@/g, `${dataToSendMail.securyDataFinalSuranceTerm}`)
            // COBERTURAS CONTRATADAS
            .replace(/@@max_limit_thieft@@/g, `${dataToSendMail.maxLimitThieft}`)
            .replace(/@@pos_thieft@@/g, `${dataToSendMail.posThieft}`)
            .replace(/@@prize_thieft@@/g, `${dataToSendMail.prizeThieft}`)
            .replace(/@@lack_thieft@@/g, `${dataToSendMail.lackThieft}`)
            .replace(/@@max_limit_acidental@@/g, `${dataToSendMail.maxLimitAcidental}`)
            .replace(/@@pos_acidental@@/g, `${dataToSendMail.posAcidental}`)
            .replace(/@@prize_acidental@@/g, `${dataToSendMail.prizeAcidental}`)
            .replace(/@@lack_acidental@@/g, `${dataToSendMail.lackAcidental}`)
            .replace(/@@product_description@@/g, `${dataToSendMail.productDescription}`)
            .replace(/@@model@@/g, `${dataToSendMail.model}`)
            .replace(/@@mark@@/g, `${dataToSendMail.mark}`)
            .replace(/@@payment_form@@/g, `${dataToSendMail.paymentForm}`)
            .replace(/@@liquid_prize@@/g, `${dataToSendMail.liquidPrice}`)
            .replace(/@@iof@@/g, `${dataToSendMail.iof}`)
            .replace(/@@total_prize@@/g, `${dataToSendMail.totalPrize}`)

        const forceEmailSender = await this.parameterStore.getSecretValue("FORCE_EMAIL_SENDER")
        const accessKeyId = await this.parameterStore.getSecretValue("MAIL_ACCESS_KEY_ID")
        const secretAccessKey = await this.parameterStore.getSecretValue("MAIL_SECRET_ACCESS_KEY")
        const emailFrom = forceEmailSender ? forceEmailSender : 'no-reply@amedigital.com'
        log.debug(`EmailFrom:${emailFrom}`)

        try {                   
            const sendResult = await EmailSender.sendEmail(emailFrom, email, body, accessKeyId, secretAccessKey)
            return sendResult.MessageId
        } catch (e) {
            console.error('Email not sent, error', e);
            throw 'Error during sending email'
        }

    }

    async formatMailJsonParseInfo(MailInfo) {

        const UserData = MailInfo?.attributes?.customPayload?.proposal?.insured_data
        const policyHolderData = MailInfo?.attributes?.customPayload?.proposal?.policyholder_data

        const dataToSendMail: DataToSendMail = {
            securityName: UserData.insured_name,
            securityUserCpf: UserData?.cnpj_cpf,
            securityAddress: UserData?.address_data.street,
            securityAddressNumber: UserData?.address_data.number,
            securityAddressDistrict: UserData?.address_data.district,
            securityAddressCity: UserData?.address_data.city,
            securityAddressUf: UserData?.address_data.federal_unit,
            securityDataUserCep: UserData?.address_data.zip_code,

            SecurityRepresentationSocialReazon: policyHolderData?.corporate_name_policyholder_name,
            SecurityRepresentationCnpj: policyHolderData?.cnpj_cpf,

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
            productDescription: MailInfo?.attributes?.customPayload?.proposal.portable_equipment_risk_data.product_description,
            model: MailInfo?.attributes?.customPayload?.proposal.portable_equipment_risk_data.product_description,
            mark: MailInfo?.attributes?.customPayload?.proposal.portable_equipment_risk_data.manufacturer_name,
            paymentForm: MailInfo?.operationType,
            liquidPrice: MailInfo?.amount,
            iof: '-',
            totalPrize: '-'
        }

        return dataToSendMail;
    }
}