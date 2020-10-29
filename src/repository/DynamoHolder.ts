import AWS from 'aws-sdk';
import {ServiceConfigurationOptions} from 'aws-sdk/lib/service';
import {inject, injectable} from "inversify";
import DynamoDB from "aws-sdk/clients/dynamodb";
import { ParameterStore } from '../configs/ParameterStore';

let dynamo: DynamoDB;
let dynamoDocClient: AWS.DynamoDB.DocumentClient;


@injectable()
export class DynamoHolder {

    constructor()
    {
        let serviceConfigOptions: ServiceConfigurationOptions = {
            region: "us-east-1"
        };
        if (process.env.NODE_ENV == 'test') {
            serviceConfigOptions.endpoint = process.env.DYNAMODB_HOST || "http://localhost:8000"
        }
        dynamo = new AWS.DynamoDB(serviceConfigOptions);
        dynamoDocClient = new AWS.DynamoDB.DocumentClient({service: dynamo});
    }

    getDynamo(): DynamoDB {
        return dynamo;
    }

    getDynamoDocClient(): AWS.DynamoDB.DocumentClient {
        return dynamoDocClient;
    }

}
