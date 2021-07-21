import { inject, injectable } from "inversify"
import { DynamoHolder } from "../../../repository/DynamoHolder"
import { getLogger } from "../../../server/Logger"

const TABLE = `${process.env.DYNAMODB_ENV}_sold_proposal`

const log = getLogger("healthCareProposalSoldRepository")

@injectable()
export class healthCareProposalSoldRepository {
    static TABLE = TABLE

    constructor(
        @inject("DynamoHolder")
        private dynamoHolder: DynamoHolder
    ) {}

    async create(proposal: any) {
        const dynamoDocClient = await this.dynamoHolder.getDynamoDocClient()
        const params = { TableName: TABLE, Item: proposal }
        await dynamoDocClient.put(params).promise()
        log.info("Salvando os registros na tabela soldProposal")
        return proposal
    }

    async cancel(proposal: any, customerId) {
        const dynamoDocClient = await this.dynamoHolder.getDynamoDocClient()
        const params = { TableName: TABLE, Key: customerId, Item: proposal }
        await dynamoDocClient.update(params).promise()
        log.info("Salvando os registros na tabela soldProposal")
        return proposal
    }
}
