import { inject, injectable } from "inversify"
import { UnusualSoldProposal } from "../model/UnusualSoldProposal"
import { getLogger } from "../../../server/Logger"
import { DynamoHolder } from "../../../repository/DynamoHolder"

const TABLE = `${process.env.DYNAMODB_ENV}_sold_proposal`

const log = getLogger("SmartphoneSoldProposalRepository")

@injectable()
export class UnusualRepository {
    static TABLE = TABLE

    constructor(
        @inject("DynamoHolder")
        private dynamoHolder: DynamoHolder
    ) {}

    async create(soldProposal: UnusualSoldProposal) {
        log.debug("TRYING TO WRITE ON", TABLE)
        const dynamoDocClient = await this.dynamoHolder.getDynamoDocClient()
        const params = { TableName: TABLE, Item: soldProposal }
        await dynamoDocClient.put(params).promise()
        log.debug("REGISTER WROTE ON", TABLE)
        return soldProposal
    }
}
