import {injectable, inject} from "inversify";
import {DynamoHolder} from "../../../repository/DynamoHolder";
import {getLogger} from "../../../server/Logger";
import {ResidentialSoldProposal} from "../model/ResidentialSoldProposal";
import {Tenants} from "../../default/model/Tenants";

const TABLE = `${process.env.DYNAMODB_ENV}_sold_proposal`;

const log = getLogger("ResidentialSoldProposalRepository")

@injectable()
export class ResidentialSoldProposalRepository {

    static TABLE = TABLE

    constructor(
        @inject("DynamoHolder")
        private dynamoHolder: DynamoHolder
    ) {
    }

    async create(soldProposal: ResidentialSoldProposal) {
        let dynamoDocClient = await this.dynamoHolder.getDynamoDocClient();
        let params = {TableName: TABLE, Item: soldProposal};
        await dynamoDocClient.put(params).promise();
        return soldProposal
    }

    async findAllFromCustomer(customerId: string) {
        log.debug(`Searching for Proposals in Table: ${TABLE}, customerId: ${customerId}`)
        let params = {
            TableName: TABLE,
            KeyConditionExpression: "#customerId = :customerId and #tenant = :tenant",
            ExpressionAttributeNames: {
                "#customerId": "customerId",
                "#tenant": "tenant",
            },
            ExpressionAttributeValues: {
                ":customerId": customerId,
                ":tenant": Tenants.SMARTPHONE
            }
        };
        try {
            let dynamoDocClient = await this.dynamoHolder.getDynamoDocClient();
            let result = await dynamoDocClient.query(params).promise();
            log.debug(`Have found ${result.Items?.length} items`)
            return result.Items?.filter(x => x.tenant === Tenants.RESIDENTIAL)
        } catch (e) {
            log.error(`Error on searching results from ${TABLE}`)
            log.error(e)
            return []
        }
    }

    /**
     * Este método é utilizado apenas durante os testes
     */
    async deleteByCustomerAndOrder(customerId: string, order: string) {
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
