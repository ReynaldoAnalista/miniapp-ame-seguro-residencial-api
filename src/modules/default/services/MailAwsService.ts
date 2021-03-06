import { inject, injectable } from "inversify"

import { getLogger } from "../../../server/Logger"
import { TYPES } from "../../../inversify/inversify.types"
import { ParameterStore } from "../../../configs/ParameterStore"
import { SimpleEmail } from "../../default/model/SimpleEmail"
import { MailSender } from "./MailSender"
import AWS from "aws-sdk"

const logger = getLogger("MailService")
AWS.config.update({
    region: "us-east-1",
})

@injectable()
export class MailAwsService implements MailSender {
    constructor(
        @inject(TYPES.ParameterStore)
        private parameterStore: ParameterStore
    ) {}

    accessKeyId: any
    secretAccessKey: any

    async makeAWSSES(): Promise<AWS.SES> {
        const apiVersion = "2010-12-01"

        let accessKeyId = process.env.MAIL_ACCESS_KEY_ID || (await this.parameterStore.getSecretValue("MAIL_ACCESS_KEY_ID"))

        if (!accessKeyId) {
            accessKeyId = process.env.AWS_ACCESS_KEY_ID
        }

        let secretAccessKey =
            process.env.MAIL_SECRET_ACCESS_KEY || (await this.parameterStore.getSecretValue("MAIL_SECRET_ACCESS_KEY"))
        if (!secretAccessKey) {
            secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
        }

        this.accessKeyId = accessKeyId
        this.secretAccessKey = secretAccessKey

        return new AWS.SES({ apiVersion, accessKeyId, secretAccessKey })
    }

    async send(email: SimpleEmail) {
        const AWSSES = await this.makeAWSSES()
        if (!this.accessKeyId) {
            logger.warn("Envio de email nao configurado")
            return Promise.resolve({})
        }
        const mailFormat = await this.createRawMessage(email)
        const params = {
            RawMessage: { Data: mailFormat },
        }

        if (email.test == true) return false

        return AWSSES.sendRawEmail(params).promise()
    }

    async createRawMessage(email: SimpleEmail) {
        const mimemessage = require("mimemessage")

        const mailContent = mimemessage.factory({ contentType: "multipart/mixed", body: [] })
        mailContent.header("From", email.from)
        mailContent.header("To", email.to)
        mailContent.header("Subject", email.subject)

        const alternateEntity = mimemessage.factory({
            contentType: "multipart/alternate",
            body: [],
        })

        const htmlEntity = mimemessage.factory({
            contentType: "text/html;charset=utf-8",
            body: email.body,
        })

        alternateEntity.body.push(htmlEntity)
        mailContent.body.push(alternateEntity)

        //  FOI FEITA A REMO????O DA IMPLEMENTA????O DO ANEXO NO CORPO DO E-MAIL
        //  var data = fs.readFileSync('./src/files/CG_BILHETE.pdf');
        //  var attachmentEntity = mimemessage.factory({
        //     contentType: 'text/plain',
        //     contentTransferEncoding: 'base64',
        //     body: data.toString('base64').replace(/([^\0]{76})/g, "$1\n")
        // });
        // attachmentEntity.header('Content-Disposition', 'attachment ; filename="CG_BILHETE.pdf"');
        // mailContent.body.push(attachmentEntity);

        return mailContent.toString()
    }
}
