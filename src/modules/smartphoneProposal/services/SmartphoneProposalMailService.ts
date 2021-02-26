import {inject, injectable} from "inversify";
import {SimpleEmail} from "../../default/model/SimpleEmail";
import fs from "fs";
import util from "util";
import path from "path";
import { MailSender } from "../../default/services/MailSender";
import { DataToSendMail } from "../model/AmeNotification";

const readFile = util.promisify(fs.readFile)

const MAIL_FROM = process.env.MAIL_FROM || 'miniapps@calindra.com.br'

@injectable()
export class SmartphoneProposalMailService {

    constructor(
        @inject("MailSender")
        private mailSender: MailSender
    ) {
    }

    // async sendSellingEmail(dataToSendMail: DataToSendMail) {
    //     logger.debug('Enviando email de compra', {email: dataToSendMail.securityMail})
    //     let emailTemplate = path.resolve(__dirname, '../../../../mail_template/smartphone_mail.html')
    //     logger.debug(`Obtendo template de email pelo endereço: ${emailTemplate}`)
    //     try {
    //         let template = await readFile(emailTemplate, 'utf-8')
    //         let body = template
    //         let email = { 
    //             from: MAIL_FROM,
    //             subject: 'Cupom bilhete seguro',
    //             to: dataToSendMail.securityMail,
    //             body: body
    //         } as SimpleEmail
    //         await this.send(email)
    //     } catch (e) {
    //         logger.error(`Erro ao enviar email de cupom.`)
    //         logger.error(e)
    //         throw 'Erro ao enviar email de cupom'
    //     }
    // }
    async sendSellingEmail() {        
        let emailTemplate = path.resolve(__dirname, '../../../../mail_template/smartphone_mail.html')        
        try {
            let template = await readFile(emailTemplate, 'utf-8')
            let body = template
            let email = { 
                from: MAIL_FROM,
                subject: 'Cupom bilhete seguro',
                to: 'mestrerey@gmail.com',
                body: body
            } as SimpleEmail
            await this.send(email)
        } catch (e) {
            console.debug('ERRO ENVIO' , e);            
            throw 'Erro ao enviar email de cupom'
        }
    }

    async send(email: SimpleEmail) {
        await this.mailSender.send(email)
    }
}
