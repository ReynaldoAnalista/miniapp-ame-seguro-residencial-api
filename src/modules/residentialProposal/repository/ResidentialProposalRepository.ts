import {injectable, inject} from "inversify";
import {DynamoHolder} from "../../../repository/DynamoHolder";
import {getLogger} from "../../../server/Logger";

const TABLE = `${process.env.DYNAMODB_ENV}_seguro_residencial`;

const log = getLogger("PlanRepository")

@injectable()
export class ResidentialProposalRepository {

    static TABLE = TABLE

    constructor(
        @inject("DynamoHolder")
        private dynamoHolder: DynamoHolder
    ) {
    }

    async create(proposal: any) {
        log.debug('TRYING TO WRITE ON', TABLE)
        let dynamoDocClient = await this.dynamoHolder.getDynamoDocClient();
        let params = {TableName: TABLE, Item: proposal};
        await dynamoDocClient.put(params).promise();
        return proposal
    }

    async findByEmail(email: string) {
        let params = {
            TableName: TABLE,
            Key: {
                "email": email
            }
        };
        let dynamoDocClient = await this.dynamoHolder.getDynamoDocClient();

        let result = await dynamoDocClient.get(params).promise();
        return result.Item
    }

    async update(proposal) {
        let dynamoDocClient = await this.dynamoHolder.getDynamoDocClient();
        let params = {
            TableName: TABLE,
            Item: proposal
        };
        await dynamoDocClient.put(params).promise();
        return proposal
    }

    async listProposal() {
        let dynamoDocClient = await this.dynamoHolder.getDynamoDocClient();
        let scanResult = await dynamoDocClient.scan({
            TableName: TABLE,
            FilterExpression: 'attribute_exists(email)'
        }).promise()
        if (scanResult.Count && scanResult.Items && scanResult.Items.length)
            return scanResult.Items
        else
            return []
    }

}
