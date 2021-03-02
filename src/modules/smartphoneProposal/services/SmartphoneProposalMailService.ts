import {inject, injectable} from "inversify";
import {SimpleEmail} from "../../default/model/SimpleEmail";
import fs from "fs";
import util from "util";
import path from "path";
import { MailSender } from "../../default/services/MailSender";
import { DataToSendMail } from "../model/DataToSendMail";
import { SmartphoneProposalRepository } from '../repository/SmartphoneProposalRepository'

const readFile = util.promisify(fs.readFile)

const MAIL_FROM = process.env.MAIL_FROM || 'miniapps@calindra.com.br'

@injectable()
export class SmartphoneProposalMailService {

    constructor(
        @inject("MailSender")
        private mailSender: MailSender,
        @inject("SmartphoneProposalRepository")
        private smartphoneProposalRepository: SmartphoneProposalRepository,
    ) {
    }

    async sendSellingEmail(pass: string) {        
        let emailTemplate = path.resolve(__dirname, '../../../../mail_template/smartphone_mail.html')
        let dataTogetPass = await this.smartphoneProposalRepository.findByID(pass)
        const dataToSendMail =  await this.formatMailJsonParseInfo(dataTogetPass)

        try {
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
            .replace(/@@cod_susep@@/g, `${dataToSendMail.SecurityRepresentationCodSusep}`)
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
            let email = { 
                from: MAIL_FROM,
                subject: 'Cupom bilhete seguro',
                // to: sentMail,
                body: body
            } as SimpleEmail
            const emailSent = await this.send(email)
            return true
        } catch (e) {
            console.debug('ERRO ENVIO' , e);            
            throw 'Erro ao enviar email de cupom'
        }
    }

    async send(email: SimpleEmail) {
        await this.mailSender.send(email)
    }

    async formatMailJsonParseInfo(MailInfo) {

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
}