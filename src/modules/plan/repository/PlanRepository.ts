import { injectable, inject } from "inversify";
import {DynamoHolder} from "../../../repository/DynamoHolder";
import { Proposal } from "../model/Proposal";

const TABLE          = `${process.env.DYNAMODB_ENV}_seguro_residencial`;

@injectable()
export class PlanRepository {

    static TABLE = TABLE

    constructor(
        @inject("DynamoHolder")
        private dynamoHolder: DynamoHolder
    ) { }

    async create(proposal: Proposal): Promise<Proposal> {
        console.log('gravando', TABLE)
        let dynamoDocClient = await this.dynamoHolder.getDynamoDocClient();
        let params = {TableName:  TABLE, Item: proposal};
        await dynamoDocClient.put(params).promise();
        return proposal
    }

    async findByEmail(email: string): Promise<Proposal> {
        let params = {
            TableName : TABLE,
            Key: {
                "email": email
            }
        };
        let dynamoDocClient = await this.dynamoHolder.getDynamoDocClient();

        let result = await dynamoDocClient.get(params).promise();
        return result.Item as Proposal
    }

    async update(proposal: Proposal) {
        let dynamoDocClient = await this.dynamoHolder.getDynamoDocClient();
        let params = {
            TableName: TABLE,
            Item: proposal
        };
        await dynamoDocClient.put(params).promise();
        return proposal
    }

}
