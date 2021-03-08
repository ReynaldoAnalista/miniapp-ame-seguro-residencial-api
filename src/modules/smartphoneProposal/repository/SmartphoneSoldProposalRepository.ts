import {injectable, inject} from "inversify";
import {DynamoHolder} from "../../../repository/DynamoHolder";
import {getLogger} from "../../../server/Logger";
import {SmartphoneSoldProposal} from "../model/SmartphoneSoldProposal";
import {Tenants} from "../../default/model/Tenants";

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

    async checkTable() {
        log.debug(`Checking table: ${TABLE}`)
        try {
            let dynamoDocClient = await this.dynamoHolder.getDynamoDocClient();
            await dynamoDocClient.get({
                TableName: TABLE,
                Key: {
                    "customerId": "a"
                }
            }).promise();
            return true
        } catch (e) {
            log.error(`Table ${TABLE} not exists`)
            log.error(e)
        }
        return false
    }

    async create(soldProposal: SmartphoneSoldProposal) {
        log.debug('TRYING TO WRITE ON', TABLE);
        let dynamoDocClient = await this.dynamoHolder.getDynamoDocClient();
        let params = {TableName: TABLE, Item: soldProposal};
        await dynamoDocClient.put(params).promise();
        log.debug('REGISTER WROTE ON', TABLE);
        return soldProposal
    }
    
    async update(soldProposal: SmartphoneSoldProposal) {
        log.debug('TRYING UPDATE ON', TABLE);
        let dynamoDocClient = await this.dynamoHolder.getDynamoDocClient();
        let params = {TableName: TABLE, Key: soldProposal};
        await dynamoDocClient.update(params).promise();
        log.debug('UPDATED ON', TABLE);
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
        try {
            let dynamoDocClient = await this.dynamoHolder.getDynamoDocClient();
            let result = await dynamoDocClient.query(params).promise();
            return result.Items?.filter(x => x.tenant === Tenants.SMARTPHONE)
        } catch (e) {
            log.debug(e.message)
            return []
        }
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
