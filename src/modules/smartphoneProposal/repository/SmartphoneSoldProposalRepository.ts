import {injectable, inject} from "inversify";
import {DynamoHolder} from "../../../repository/DynamoHolder";
import {getLogger} from "../../../server/Logger";
import {SmartphoneSoldProposal} from "../model/SmartphoneSoldProposal";

const TABLE = `${process.env.DYNAMODB_ENV}_sold_proposal`;

const log = getLogger("SmartphoneSoldProposalRepository")

@injectable()
export class SmartphoneSoldProposalRepository {

    static TABLE = TABLE

    constructor(
        @inject("DynamoHolder")
        private dynamoHolder: DynamoHolder
    ) {
    }

    async create(soldProposal: SmartphoneSoldProposal) {
        log.debug('TRYING TO WRITE ON', TABLE);
        let dynamoDocClient = await this.dynamoHolder.getDynamoDocClient();
        let params = {TableName: TABLE, Item: soldProposal};
        await dynamoDocClient.put(params).promise();
        log.debug('REGISTER WROTE ON', TABLE);
        return soldProposal
    }

    async findAllFromCustomer(customerId: string) {
        log.debug(`Searching for plans from customerId = ${customerId}`)
        let params = {
            TableName: TABLE,
            KeyConditionExpression: "customerId = :customerId",
            ExpressionAttributeValues: {
                ":customerId": customerId
            }
        };
        let dynamoDocClient = await this.dynamoHolder.getDynamoDocClient();
        let result = await dynamoDocClient.query(params).promise();
        return result.Items?.filter(x => x.tenant === 'SMARTPHONE')
    }

    /**
     * Este método é utilizado apenas durante os testes
     */
    async deleteByCustomerAndOrder(customerId: string, order: string) {
        log.debug(`Deleting customerId=${customerId} AND order=${order}`)
        let dynamoDocClient = await this.dynamoHolder.getDynamoDocClient();
        let params = {
            TableName: TABLE,
            Key: {
                "customerId": customerId,
                "order": order
            },
        };
        await dynamoDocClient.delete(params).promise();
    }

}
