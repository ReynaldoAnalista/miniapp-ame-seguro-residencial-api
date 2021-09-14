import { inject, injectable } from "inversify"
import { DynamoHolder } from "../../../repository/DynamoHolder"
import { getLogger } from "../../../server/Logger"

const log = getLogger("MaintenanceRepository")

const TABLE = `${process.env.DYNAMODB_ENV}_sold_proposal`

@injectable()
export class MaintenanceRepository {
    constructor(
        @inject("DynamoHolder")
        private dynamoHolder: DynamoHolder
    ) {}

    async updateSoldProposalOrdersType(soldProposal) {
        try {
            log.debug("TRYING UPDATE ON", TABLE)
            const dynamoDocClient = await this.dynamoHolder.getDynamoDocClient()
            const params = {
                TableName: TABLE,
                Key: { order: soldProposal.order, customerId: soldProposal.customerId },
                UpdateExpression: "SET #st = :val1",
                ExpressionAttributeValues: {
                    ":val1": soldProposal.status,
                },
                ExpressionAttributeNames: {
                    "#st": "status",
                },
            }
            await dynamoDocClient.update(params).promise()
            log.debug("UPDATED ON", TABLE)
            return 1
        } catch (e: any) {
            log.error(`ERROR on Updated ${TABLE}: ${e}`)
            return 0
        }
    }

    async getCancelledOrder(customerId) {
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
            return result.Items?.filter((x) => x.status == "CANCELED")
        } catch (e: any) {
            log.error(`Error on searching results from ${TABLE}`)
            log.error(e)
            return []
        }
    }
}
