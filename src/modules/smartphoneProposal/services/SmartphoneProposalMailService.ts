import {inject, injectable} from "inversify";
import {SimpleEmail} from "../../default/model/SimpleEmail";
import * as fs from "fs";
import * as util from "util";
import * as path from "path";
import {getLogger} from "../../../server/Logger";
import { MailSender } from "../../default/services/MailSender";
import { initDependencies  } from '../../../inversify/inversify.config';
import { DataToSendMail } from "../model/AmeNotification";


const logger = getLogger("MailService")
const readFile = util.promisify(fs.readFile)

const MAIL_FROM = process.env.MAIL_FROM || 'miniapps@calindra.com.br'

initDependencies()


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
        logger.debug('Enviando email de compra', {email: 'dataToSendMail.securityMail'})
        let emailTemplate = path.resolve(__dirname, '../../../../mail_template/smartphone_mail.html')
        logger.debug(`Obtendo template de email pelo endereço: ${emailTemplate}`)
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
            logger.error(`Erro ao enviar email de cupom.`)
            logger.error(e)
            throw 'Erro ao enviar email de cupom'
        }
    }

    async send(email: SimpleEmail) {
        await this.mailSender.send(email)
    }
}
