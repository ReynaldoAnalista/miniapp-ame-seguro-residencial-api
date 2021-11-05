import { inject, injectable } from "inversify"
import { DynamoHolder } from "../../../repository/DynamoHolder"
import { getLogger } from "../../../server/Logger"
import { Tenants } from "../../default/model/Tenants"
const log = getLogger("RenewPortableSoldProposal")

const TABLE = `${process.env.DYNAMODB_ENV}_sold_proposal`

@injectable()
export class RenewPortableSoldProposal {
    constructor(
        @inject("DynamoHolder")
        private dynamoHolder: DynamoHolder
    ) {}

    async create(soldProposal: any) {
        log.debug("TRYING TO WRITE ON", TABLE)
        const dynamoDocClient = await this.dynamoHolder.getDynamoDocClient()
        const params = { TableName: TABLE, Item: soldProposal }
        await dynamoDocClient.put(params).promise()
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
            return result.Items?.filter((x) => x.tenant === Tenants.RENEW_PORTABLE)
        } catch (e) {
            log.error(`Error on searching results from ${TABLE}`)
            log.error(e)
            return []
        }
    }
}
