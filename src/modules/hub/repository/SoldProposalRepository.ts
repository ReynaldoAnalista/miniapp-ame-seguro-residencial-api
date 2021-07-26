import { injectable, inject } from "inversify"
import { DynamoHolder } from "../../../repository/DynamoHolder"
import { getLogger } from "../../../server/Logger"

const TABLE = `${process.env.DYNAMODB_ENV}_sold_proposal`

const log = getLogger("SoldProposalRepository")

@injectable()
export class SoldProposalRepository {
    static TABLE = TABLE

    constructor(
        @inject("DynamoHolder")
        private dynamoHolder: DynamoHolder
    ) {}

    async deleteByCustomerAndOrder(customerId: string, orderId: string) {
        const environment = process.env.DYNAMODB_ENV
        if (environment === "prod") {
            throw "Delete data is not alowed in production environment"
        }
        log.debug(`Deleting customerId=${customerId} AND orderId=${orderId}`)
        const dynamoDocClient = await this.dynamoHolder.getDynamoDocClient()
        const params = {
            TableName: TABLE,
            Key: {
                customerId: customerId,
                order: orderId,
            },
        }
        await dynamoDocClient.delete(params).promise()
    }
}
