import { inject, injectable } from "inversify"
import { DynamoHolder } from "../../../repository/DynamoHolder"
import { getLogger } from "../../../server/Logger"
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
}
