import {inject, injectable} from "inversify";

import {getLogger} from "../../../server/Logger";
import {TYPES} from "../../../inversify/inversify.types";
import {ParameterStore} from "../../../configs/ParameterStore";
import { SimpleEmail } from "../../default/model/SimpleEmail";
import { MailSender } from "./MailSender";

const logger = getLogger("MailService")
const AWS = require('aws-sdk')
AWS.config.update({
    region: 'us-east-1'
})

@injectable()
export class MailAwsService implements MailSender {

    constructor(
        @inject(TYPES.ParameterStore)
        private parameterStore: ParameterStore
    ) {
    }

    accessKeyId: any
    secretAccessKey: any

    async makeAWSSES(): Promise<AWS.SES> {
        const apiVersion = '2010-12-01';

        let accessKeyId = process.env.MAIL_ACCESS_KEY_ID || await this.parameterStore.getSecretValue('MAIL_ACCESS_KEY_ID')
        
        if (!accessKeyId) {
            accessKeyId = process.env.AWS_ACCESS_KEY_ID;
        }

        let secretAccessKey = process.env.MAIL_SECRET_ACCESS_KEY || await this.parameterStore.getSecretValue('MAIL_SECRET_ACCESS_KEY')
        if (!secretAccessKey) {
            secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
        }

        this.accessKeyId = accessKeyId
        this.secretAccessKey = secretAccessKey

        return new AWS.SES({apiVersion, accessKeyId, secretAccessKey})
    }

    async send(email: SimpleEmail) {
        const AWSSES = await this.makeAWSSES()
        if (!this.accessKeyId) {
            logger.warn('Envio de email nao configurado')
            return Promise.resolve({})
        }        

        var date = new Date();
        var boundary = `----=_Part${ Math.random().toString().substr( 2 ) }`;

        var rawMessage = [
            `From: "${ email.from }" <${ email.from }>`, // Can be just the email as well without <>
            `To: ${ email.to }`,
            `Subject: ${ email.subject }`,
            `MIME-Version: 1.0`,
            `Content-Type: multipart/alternative; boundary="${ boundary }"`, // For sending both plaintext & html content
            // ... you can add more headers here as decribed in https://docs.aws.amazon.com/ses/latest/DeveloperGuide/header-fields.html
            `\n`,
            `--${ boundary }`,
            `Content-Type: text/plain; charset=UTF-8`,
            `Content-Transfer-Encoding: 7bit`,
            `\n`,            
            `--${ boundary }`,
            `Content-Type: text/html; charset=UTF-8`,
            `Content-Transfer-Encoding: 7bit`,
            `\n`,
            email.body,
            `\n`,
            `--${ boundary }--`
        ]
        // TODO TERMINAR O RAW EMAIL
    

        let params = {
            RawMessage: {Data: rawMessage}
        } 

        return AWSSES.sendRawEmail(params).promise()
    }
}
