import {inject, injectable} from "inversify";

import {getLogger} from "../../../server/Logger";
import {TYPES} from "../../../inversify/inversify.types";
import {ParameterStore} from "../../../configs/ParameterStore";
import { SimpleEmail } from "../../default/model/SimpleEmail";
import { MailSender } from "./MailSender";

import fs from "fs";

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
        let mailFormat = await this.createRawMessage(email);
        let params = {
            RawMessage: {Data: mailFormat}
        } 

        return AWSSES.sendRawEmail(params).promise()
    }

    async createRawMessage(email: SimpleEmail) {
        
        var mimemessage = require('mimemessage');

        var mailContent = mimemessage.factory({contentType: 'multipart/mixed',body: []});
        mailContent.header('From', email.from);
        mailContent.header('To', email.to);
        mailContent.header('Subject', email.subject);
        
        var alternateEntity = mimemessage.factory({
            contentType: 'multipart/alternate',
            body: []
        });

        var htmlEntity = mimemessage.factory({
            contentType: 'text/html;charset=utf-8',
            body:  email.body
          });
         
         alternateEntity.body.push(htmlEntity);         
         mailContent.body.push(alternateEntity);

         var data = fs.readFileSync('./src/files/CG_BILHETE.pdf');

         var attachmentEntity = mimemessage.factory({
            contentType: 'text/plain',
            contentTransferEncoding: 'base64',
            body: data.toString('base64').replace(/([^\0]{76})/g, "$1\n")
        });

        attachmentEntity.header('Content-Disposition', 'attachment ; filename="CG_BILHETE.pdf"');

        mailContent.body.push(attachmentEntity);

        return mailContent.toString()
    }
}
