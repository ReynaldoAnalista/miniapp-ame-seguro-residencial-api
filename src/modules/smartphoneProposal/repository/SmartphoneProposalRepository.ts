import {injectable, inject} from "inversify";
import {DynamoHolder} from "../../../repository/DynamoHolder";
import {getLogger} from "../../../server/Logger";

const TABLE = `${process.env.DYNAMODB_ENV}_seguro_celular_compras`;

const log = getLogger("SmartphoneProposalRepository")

@injectable()
export class SmartphoneProposalRepository {

    static TABLE = TABLE

    constructor(
        @inject("DynamoHolder")
        private dynamoHolder: DynamoHolder
    ) {
    }

    async checkTable() {
        log.debug(`Checking table: ${TABLE}`)
        try {
            let dynamoDocClient = await this.dynamoHolder.getDynamoDocClient();
            await dynamoDocClient.get({
                TableName: TABLE,
                Key: {
                    "id": "a"
                }
            }).promise();
            return true
        } catch (e) {
            log.error(`Table ${TABLE} not exists`)
            log.error(e)
        }
        return false
    }

    async create(proposal: any) {
        log.debug('TRYING TO WRITE ON', TABLE);
        let dynamoDocClient = await this.dynamoHolder.getDynamoDocClient();
        let params = {TableName: TABLE, Item: proposal};
        await dynamoDocClient.put(params).promise();
        log.debug('REGISTER WROTE ON', TABLE);
        return proposal
    }

    async findByID(id: string) {
        let params = {
            TableName: TABLE,
            Key: {
                "id": id
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
            FilterExpression: 'attribute_exists(id)'
        }).promise()
        if (scanResult.Count && scanResult.Items && scanResult.Items.length)
            return scanResult.Items
        else
            return []
    }

}
