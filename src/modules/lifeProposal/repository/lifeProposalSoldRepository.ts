import { inject, injectable } from "inversify"
import { DynamoHolder } from "../../../repository/DynamoHolder"
import { getLogger } from "../../../server/Logger"

const TABLE = `${process.env.DYNAMODB_ENV}_sold_proposal`

const log = getLogger("lifeProposalSoldRepository")

@injectable()
export class lifeProposalSoldRepository {
    static TABLE = TABLE

    constructor(
        @inject("DynamoHolder")
        private dynamoHolder: DynamoHolder
    ) {}

    async create(proposal: any) {
        const dynamoDocClient = await this.dynamoHolder.getDynamoDocClient()
        const params = { TableName: TABLE, Item: proposal }
        await dynamoDocClient.put(params).promise()
        log.info("Salvando os registros HealthCare na tabela soldProposal")
        return proposal
    }
}
