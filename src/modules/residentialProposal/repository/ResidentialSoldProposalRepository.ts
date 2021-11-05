import { injectable, inject } from "inversify"
import { DynamoHolder } from "../../../repository/DynamoHolder"
import { getLogger } from "../../../server/Logger"
import { ResidentialSoldProposal } from "../model/ResidentialSoldProposal"
import { Tenants } from "../../default/model/Tenants"

const TABLE = `${process.env.DYNAMODB_ENV}_sold_proposal`

const log = getLogger("ResidentialSoldProposalRepository")

@injectable()
export class ResidentialSoldProposalRepository {
    static TABLE = TABLE

    constructor(
        @inject("DynamoHolder")
        private dynamoHolder: DynamoHolder
    ) {}

    async create(soldProposal: ResidentialSoldProposal) {
        log.debug("TRYING TO WRITE ON", TABLE)
        const dynamoDocClient = await this.dynamoHolder.getDynamoDocClient()
        await dynamoDocClient.put({ TableName: TABLE, Item: soldProposal }).promise()
        log.debug("REGISTER WROTE ON", TABLE)
        return soldProposal
    }

    async findAllFromCustomer(customerId: string) {
        log.debug(`Searching for Proposals in Table: ${TABLE}, customerId: ${customerId}`)
        const params = {
            TableName: TABLE,
            KeyConditionExpression: "#customerId = :customerId",
            ExpressionAttributeNames: {
                "#customerId": "customerId",
            },
            ExpressionAttributeValues: {
                ":customerId": customerId,
            },
        }
        try {
            const dynamoDocClient = await this.dynamoHolder.getDynamoDocClient()
            const result = await dynamoDocClient.query(params).promise()
            log.debug(`Have found ${result.Items?.length} items`)
            return result.Items?.filter((x) => x.tenant === Tenants.RESIDENTIAL)
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
        const dynamoDocClient = await this.dynamoHolder.getDynamoDocClient()
        const params = {
            TableName: TABLE,
            Key: {
                customerId: customerId,
                order: order,
            },
        }
        await dynamoDocClient.delete(params).promise()
    }
}
