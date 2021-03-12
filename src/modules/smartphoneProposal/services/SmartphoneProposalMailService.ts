import { inject, injectable } from "inversify";
import fs from "fs";
import util from "util";
import path from "path";
import { DataToSendMail } from "../model/DataToSendMail";
import { SmartphoneProposalRepository } from '../repository/SmartphoneProposalRepository'
import EmailSender from "./EmailSender";
import { TYPES } from "../../../inversify/inversify.types";
import { ParameterStore } from "../../../configs/ParameterStore";
import { getLogger } from "../../../server/Logger";
import moment from 'moment';
import { loggers } from "winston";

const readFile = util.promisify(fs.readFile)
const log = getLogger("SmartphoneProposalMailService")

const logger = getLogger("SmartphoneProposalMailService")


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
        log.debug(`Sending email: ${pass}`)
        const paymentObject = await this.smartphoneProposalRepository.findByID(pass)
        if (paymentObject) {
            return await this.sendSellingEmailByPaymentObject(paymentObject)
        }
        log.error("Order not found")
        throw new Error("Order not found")
    }
    
    // TODO : Feito somente para testes, retirada depois
    async sendSellingEmailWithParams(pass: string, email: string) {
        log.debug(`Sending email: ${pass}`)
        const paymentObject = await this.smartphoneProposalRepository.findByID(pass)
        if (paymentObject) {
            return await this.sendSellingEmailByPaymentObject(paymentObject, email)
        }
        log.error("Order not found")
        throw new Error("Order not found")
    }
    // FIMTODO

    async sendSellingEmailByPaymentObject(unsignedPayment: any, emailPass?: string) {
        
        const email = emailPass != undefined ? emailPass : unsignedPayment?.attributes?.customPayload?.clientEmail                        
        const dataToSendMail = await this.formatMailJsonParseInfo(unsignedPayment)
        logger.info('Preparando o layout do e-mail')
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
            .replace(/@@secury_data_representation@@/g, `${dataToSendMail.securyDataRepresentation}`)
            .replace(/@@carency_thieft@@/g, `${dataToSendMail.carencyThief}`)
            .replace(/@@carency_broken@@/g, `${dataToSendMail.carencyBroken}`)
            .replace(/@@carency_acident@@/g, `${dataToSendMail.carencyAcident}`)

        const forceEmailSender = await this.parameterStore.getSecretValue("FORCE_EMAIL_SENDER")
        const accessKeyId = await this.parameterStore.getSecretValue("MAIL_ACCESS_KEY_ID")
        const secretAccessKey = await this.parameterStore.getSecretValue("MAIL_SECRET_ACCESS_KEY")
        const emailFrom = forceEmailSender ? forceEmailSender : 'no-reply@amedigital.com'
        log.debug(`EmailFrom:${emailFrom}`)

        try {                   
            const sendResult = await EmailSender.sendEmail(emailFrom, email, body, accessKeyId, secretAccessKey)
            logger.info('Email Enviado')
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
            securityUserCpf: this.formatCPF(UserData?.cnpj_cpf),
            securityAddress: UserData?.address_data.street,
            securityAddressNumber: UserData?.address_data.number,
            securityAddressDistrict: UserData?.address_data.district,
            securityAddressCity: UserData?.address_data.city,
            securityAddressUf: UserData?.address_data.federal_unit,
            securityDataUserCep: UserData?.address_data.zip_code,

            SecurityRepresentationSocialReazon: 'AMEDIGITAL',
            SecurityRepresentationCnpj: "32.778.350/0001-70",

            securityDataSocialReazon: 'Mapfre Seguros Gerais SA',
            securityDataCpf: '61.074.175/0001-38',

            brokerName: 'Pulso Corretora de Seguros e Serviços de Internet Ltda.',
            brokerCodSusep: '202037915',

            securyDataBranch: '071 – Riscos Diversos – Roubo ou Furto de Eletrônicos Portáteis',
            securyDataIndividualTicket: MailInfo?.nsu,
            securyDataEmissionDate: typeof (policyData?.end_valid_document) != 'undefined' ? moment(policyData?.start_valid_document, "MMDDYYYY").format("DD/MM/YYYY") : '-',
            securyDataInitialSuranceTerm: typeof (policyData?.end_valid_document) != 'undefined' ? moment(policyData?.start_valid_document, "MMDDYYYY").format("DD/MM/YYYY") : '-',
            securyDataFinalSuranceTerm: typeof (policyData?.end_valid_document) != 'undefined' ? moment(policyData?.end_valid_document, "MMDDYYYY").format("DD/MM/YYYY") : '-',

            maxLimitThieft: selectedPlan.id == 1 ? equipamentRiskData?.equipment_value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '-',
            posThieft: selectedPlan.id == 1 ? '20%' : '-',
            carencyThief: selectedPlan.id == 1 ? 'Não há' : '-',
            prizeThieft: selectedPlan.id == 1 && (selectedPercent['thieft']) != 0 ? 'R$ ' + this.setPercent(selectedPercent['thieft'], equipamentRiskData?.equipment_value).replace('.', ',') : '-',
            lackThieft: '-',
            
            maxLimitAcidental: selectedPlan.id == 2 || selectedPlan.id == 1 ? equipamentRiskData?.equipment_value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '-',
            posAcidental: selectedPlan.id == 2 || selectedPlan.id == 1 ? '15%' : '-', 
            prizeAcidental: (selectedPercent['acidental_broken']) !=  0 ? 'R$ ' + this.setPercent(selectedPercent['acidental_broken'], equipamentRiskData?.equipment_value).replace('.', ',') : '-',
            lackAcidental: '-',
            carencyAcident: selectedPlan.id == 1 || selectedPlan.id == 2 ? 'Não há' : '-',

            glassProtectMaxLimit: equipamentRiskData?.equipment_value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
            glassProtectPos: (selectedPlan.id == 1 || selectedPlan.id == 2 || selectedPlan.id == 3) ? '10%' : '-',
            glassProtectCoverPrize: selectedPercent['broken_glass'] != 0 ? 'R$ ' + this.setPercent(selectedPercent['broken_glass'], equipamentRiskData?.equipment_value).replace('.', ',') : '-',
            glassProtectCarency: '-',
            carencyBroken: selectedPlan.id == 3 || selectedPlan.id == 2 || selectedPlan.id == 1 ? 'Não há' : '-',

            productDescription: MailInfo?.attributes?.customPayload?.proposal.portable_equipment_risk_data.product_description,
            model: '-',
            mark: '-',
            paymentForm: MailInfo?.operationType,
            liquidPrice: 'R$ ' + this.setPercent(selectedPercent['liquid_prize'], equipamentRiskData?.equipment_value).replace('.', ','),
            iof: 'R$' + (Math.abs(parseFloat(this.setPercent(selectedPercent['liquid_prize'], equipamentRiskData?.equipment_value)) * 1.0738) - parseFloat(this.setPercent(selectedPercent['liquid_prize'], equipamentRiskData?.equipment_value))).toFixed(2).replace('.', ','),
            totalPrize: 'R$ ' + (parseFloat(this.setPercent(selectedPercent['liquid_prize'], equipamentRiskData?.equipment_value)) * 1.0738).toFixed(2).replace('.', ','),
            securyDataRepresentation: (parseFloat(this.setPercent(selectedPercent['liquid_prize'], equipamentRiskData?.equipment_value).replace(',', '.')) * 32 / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
        }
        return dataToSendMail;
    }

    setPercent(percent, value) {
        return (value * percent / 100).toFixed(2)
    }

    formatCnpj(v) {
        v = v.replace(/\D/g, "")                           //Remove tudo o que não é dígito
        v = v.replace(/^(\d{2})(\d)/, "$1.$2")             //Coloca ponto entre o segundo e o terceiro dígitos
        v = v.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3") //Coloca ponto entre o quinto e o sexto dígitos
        v = v.replace(/\.(\d{3})(\d)/, ".$1/$2")           //Coloca uma barra entre o oitavo e o nono dígitos
        v = v.replace(/(\d{4})(\d)/, "$1-$2")              //Coloca um hífen depois do bloco de quatro dígitos
        return v
    }

    formatCPF(cpf) {
        cpf = cpf.replace(/\D/g, "")
        cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2")
        cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2")
        cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2")
        return cpf
    }


    selectedPlanPercent(selectedPlan) {
        if (selectedPlan) {
            log.debug(`Selecting data from plan ${selectedPlan.id}`)
            switch (selectedPlan.id) {
                case 1:
                    return {
                        total: 17.8416,
                        liquid_prize: 16.6154,
                        thieft: 8.73,
                        acidental_broken: 6.1114,
                        broken_glass: 3
                    }
                case 2:
                    return {
                        total: 13.8768,
                        liquid_prize: 12.9231,
                        thieft: 0,
                        acidental_broken: 9.3066,
                        broken_glass: 4.57
                    }
                case 3:
                    return {
                        total: 9.2512,
                        liquid_prize: 8.6154,
                        thieft: 0,
                        acidental_broken: 0,
                        broken_glass: 9.2512
                    }
                default:
                    return 0
            }
        }
        throw "SelectedPlan not sent"
    }
}