import { injectable, inject } from "inversify"

@injectable()
export class Secrets {
    private retrieveSecrets(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            // Use this code snippet in your app.
            // If you need more information about configurations or implementing the sample code, visit the AWS docs:
            // https://aws.amazon.com/developers/getting-started/nodejs/

            // Load the AWS SDK
            let AWS = require("aws-sdk"),
                region = "us-east-1",
                secretName = "miniapps-dev-seguro-residencial-api",
                secret,
                decodedBinarySecret

            // Create a Secrets Manager client
            const client = new AWS.SecretsManager({
                region: region,
            })

            // In this sample we only handle the specific exceptions for the 'GetSecretValue' API.
            // See https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
            // We rethrow the exception by default.

            client.getSecretValue({ SecretId: secretName }, function (err, data) {
                if (err) {
                    const errorCodes = [
                        "DecryptionFailureException",
                        "InternalServiceErrorException",
                        "InvalidParameterException",
                        "InvalidRequestException",
                        "ResourceNotFoundException",
                    ]
                    if (errorCodes.some((x) => x === err.code)) {
                        reject(err)
                    } else {
                        // Decrypts secret using the associated KMS CMK.
                        // Depending on whether the secret is a string or binary, one of these fields will be populated.
                        if ("SecretString" in data) {
                            secret = data.SecretString
                            resolve(secret)
                        } else {
                            const buff = new Buffer(data.SecretBinary, "base64")
                            decodedBinarySecret = buff.toString("ascii")
                            resolve(decodedBinarySecret)
                        }
                    }
                }
            })
        })
    }

    public async get(secretName: string) {
        const secrets = JSON.parse(await this.retrieveSecrets())
        if (secrets[secretName]) {
            return secrets[secretName]
        }
        throw "Secret Name not exists"
    }

    public async getAllSecrets() {
        return JSON.parse(await this.retrieveSecrets())
    }
}
