const AWS = require('aws-sdk');

export default class EmailSender {
    static async sendEmail(mailFrom, mailTo, HTMLContent, accessKeyId, secretAccessKey) {
        AWS.config.update({
            region: 'us-east-1',
            accessKeyId,
            secretAccessKey
        });
        const params = {
            Destination: {ToAddresses: [mailTo]},
            Message: {
                Body: {
                    Html: {
                        Charset: "UTF-8",
                        Data: HTMLContent
                    },
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: 'Bilhete do seguro'
                }
            },
            Source: mailFrom
        };
        return new AWS
            .SES({apiVersion: '2010-12-01'})
            .sendEmail(params)
            .promise();
    }
}


