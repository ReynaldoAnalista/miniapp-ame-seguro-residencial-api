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
        } catch (e) {
            log.error(`ERROR on Updated ${TABLE}: ${e}`)
            return 0
        }
    }
}
