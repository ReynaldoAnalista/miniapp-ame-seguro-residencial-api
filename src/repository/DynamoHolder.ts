import AWS from "aws-sdk"
import { ServiceConfigurationOptions } from "aws-sdk/lib/service"
import { inject, injectable } from "inversify"
import DynamoDB from "aws-sdk/clients/dynamodb"
import { ParameterStore } from "../configs/ParameterStore"
import { TYPES } from "../inversify/inversify.types"

let dynamo: DynamoDB
let dynamoDocClient: AWS.DynamoDB.DocumentClient

@injectable()
export class DynamoHolder {
    clientPromise

    constructor(
        @inject(TYPES.ParameterStore)
        private parameterStore: ParameterStore
    ) {
        this.clientPromise = (async () => {
            const serviceConfigOptions: ServiceConfigurationOptions = {
                region: "us-east-1",
                accessKeyId: process.env.AWS_ACCESS_KEY_ID || (await this.parameterStore.getSecretValue("AWS_ACCESS_KEY_ID")),
                secretAccessKey:
                    process.env.AWS_SECRET_ACCESS_KEY || (await this.parameterStore.getSecretValue("AWS_SECRET_ACCESS_KEY")),
            }
            if (process.env.NODE_ENV == "test" || process.env.DYNAMODB_HOST) {
                serviceConfigOptions.endpoint = process.env.DYNAMODB_HOST || "http://localhost:8000"
            }
            dynamo = new AWS.DynamoDB(serviceConfigOptions)
            dynamoDocClient = new AWS.DynamoDB.DocumentClient({
                service: dynamo,
            })
        })()
    }

    getDynamo(): DynamoDB {
        return dynamo
    }

    async getDynamoDocClient(): Promise<AWS.DynamoDB.DocumentClient> {
        await this.clientPromise
        return dynamoDocClient
    }
}
