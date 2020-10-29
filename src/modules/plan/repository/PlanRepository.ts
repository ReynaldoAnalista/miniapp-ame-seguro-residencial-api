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
        let dynamoDocClient = this.dynamoHolder.getDynamoDocClient();
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

        let result = await this.dynamoHolder.getDynamoDocClient().get(params).promise();
        return result.Item as Proposal
    }

    async update(proposal: Proposal) {
        let dynamoDocClient = this.dynamoHolder.getDynamoDocClient();
        let params = {
            TableName: TABLE,
            Item: proposal
        };
        await dynamoDocClient.put(params).promise();
        return proposal
    }

}
