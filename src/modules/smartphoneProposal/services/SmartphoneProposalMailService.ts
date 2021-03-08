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
import { stringify } from "qs";
import moment from 'moment';

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
            .replace(/@@max_limit_glass_protect@@/g, `${dataToSendMail.glassProtectMaxLimit}`)
            .replace(/@@pos_glass_protect@@/g, `${dataToSendMail.glassProtectPos}`)
            .replace(/@@cover_prize_glass_protect@@/g, `${dataToSendMail.glassProtectCoverPrize}`)
            .replace(/@@carency_glass_protect@@/g, `${dataToSendMail.glassProtectCarency}`)
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
        const equipamentRiskData = MailInfo?.attributes?.customPayload?.proposal?.portable_equipment_risk_data
        const policyHolderData = MailInfo?.attributes?.customPayload?.proposal?.policyholder_data
        const policyData = MailInfo?.attributes?.customPayload?.proposal?.policy_data
        const selectedPlan = MailInfo?.attributes?.customPayload?.selectedPlan               

        let selectedPercent = this.selectedPlanPercent(selectedPlan)        

        const dataToSendMail: DataToSendMail = {
            securityName: UserData.insured_name, 
            securityUserCpf: UserData?.cnpj_cpf,
            securityAddress: UserData?.address_data.street,
            securityAddressNumber: UserData?.address_data.number,
            securityAddressDistrict: UserData?.address_data.district,
            securityAddressCity: UserData?.address_data.city,
            securityAddressUf: UserData?.address_data.federal_unit,
            securityDataUserCep: UserData?.address_data.zip_code,            

            SecurityRepresentationSocialReazon: typeof(policyHolderData?.corporate_name_policyholder_name) != 'undefined' ? policyHolderData?.corporate_name_policyholder_name : '-',
            SecurityRepresentationCnpj: typeof(policyHolderData?.cnpj_cpf) != 'undefined' ? policyHolderData?.cnpj_cpf : '-',

            securityDataSocialReazon: 'Mapfre Seguros Gerais SA',
            securityDataCpf: '61074175/0001-38',

            brokerName: 'Pulso Corretora de Seguros e Serviços de Internet Ltda.',
            brokerCodSusep: '100713015',

            securyDataBranch: '071 – Riscos Diversos – Roubo ou Furto de Eletrônicos Portáteis',
            securyDataIndividualTicket: MailInfo?.nsu,
            securyDataEmissionDate: typeof(policyData?.end_valid_document) != 'undefined' ? moment(policyData?.start_valid_document, "MMDDYYYY").format("DD/MM/YYYY") : '-',
            securyDataInitialSuranceTerm: typeof(policyData?.end_valid_document) != 'undefined' ? moment(policyData?.start_valid_document, "MMDDYYYY").format("DD/MM/YYYY") : '-',
            securyDataFinalSuranceTerm: typeof(policyData?.end_valid_document) != 'undefined' ? moment(policyData?.end_valid_document, "MMDDYYYY").format("DD/MM/YYYY") : '-',            

            maxLimitThieft: 'R$: ' + equipamentRiskData?.equipment_value.toLocaleString(),
            posThieft: '20%',
            prizeThieft: (selectedPercent['thieft']) !=  0 ? this.setPercent(selectedPercent['thieft'], equipamentRiskData?.equipment_value) + '%' : '-',
            lackThieft: '-',
            
            maxLimitAcidental: 'R$: ' + equipamentRiskData?.equipment_value.toLocaleString(),
            posAcidental: '15%',
            prizeAcidental: (selectedPercent['acidental_broken']) !=  0 ? this.setPercent(selectedPercent['acidental_broken'], equipamentRiskData?.equipment_value) + '%' : '-',
            lackAcidental: '-',

            glassProtectMaxLimit: 'R$: ' + equipamentRiskData?.equipment_value.toLocaleString(),
            glassProtectPos: '10%',
            glassProtectCoverPrize: selectedPercent['broken_glass'] !=  0 ? this.setPercent(selectedPercent['broken_glass'], equipamentRiskData?.equipment_value) + '%' : '-',
            glassProtectCarency: '-',

            productDescription: MailInfo?.attributes?.customPayload?.proposal.portable_equipment_risk_data.product_description,
            model: '-',
            mark: '-',
            paymentForm: MailInfo?.operationType, 
            liquidPrice: 'R$ ' + this.setPercent(8.62, equipamentRiskData?.equipment_value),
            iof: 'R$ ' + this.setPercent(7.38, equipamentRiskData?.equipment_value), 
            totalPrize: `${selectedPercent['total'].toString().replace('.',',')}`
        }
        return dataToSendMail;
    }

    setPercent(percent, value) {        
        return (((percent * 100) / value  ) / 100).toFixed(2).toString().replace('.', ',')
    }

    selectedPlanPercent(selectedPlan) {
        switch (selectedPlan.id) {
            case 1 :
                return {
                    total: 17.84,
                    thieft: 8.73,
                    acidental_broken: 6.11,
                    broken_glass: 3
                }
            case 2:
                return {
                    total: 13.88,
                    thieft: 0,
                    acidental_broken: 9.31,
                    broken_glass: 4.57
                }            
            case 3: 
                return {
                    total: 9.25,
                    thieft: 0,
                    acidental_broken: 0,
                    broken_glass: 9.25
                }            
            default :
                return 0
        }
    }
}