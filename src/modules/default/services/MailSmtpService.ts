import { MailSender } from "./MailSender"
import { injectable, inject } from "inversify"
import { TYPES } from "../../../inversify/inversify.types"
import { ParameterStore } from "../../../configs/ParameterStore"
import { SimpleEmail } from "../model/SimpleEmail"

const nodemailer = require("nodemailer")

@injectable()
export class MailSmtpService implements MailSender {
    constructor(
        @inject(TYPES.ParameterStore)
        private parameterStore: ParameterStore
    ) {}

    async getConf() {
        const host = process.env.MAIL_SMTP_HOST || (await this.parameterStore.getSecretValue("MAIL_SMTP_HOST"))
        const port = process.env.MAIL_SMTP_PORT || (await this.parameterStore.getSecretValue("MAIL_SMTP_PORT"))
        const user = process.env.MAIL_SMTP_USER || (await this.parameterStore.getSecretValue("MAIL_SMTP_USER"))
        const pass = process.env.MAIL_SMTP_PASS || (await this.parameterStore.getSecretValue("MAIL_SMTP_PASS"))
        const from = process.env.MAIL_SMTP_FROM || (await this.parameterStore.getSecretValue("MAIL_SMTP_FROM"))
        return { host, port, user, pass, from }
    }

    async send(email: SimpleEmail) {
        const conf = await this.getConf()
        const transporter = nodemailer.createTransport({
            host: conf.host,
            port: conf.port,
            auth: {
                user: conf.user,
                pass: conf.pass,
            },
        })
        await transporter.sendMail({
            from: conf.from,
            to: email.to,
            subject: email.subject,
            html: email.body,
        })
    }
}
