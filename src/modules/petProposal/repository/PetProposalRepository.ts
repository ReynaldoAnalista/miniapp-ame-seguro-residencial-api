import { inject, injectable } from "inversify"
import { DynamoHolder } from "../../../repository/DynamoHolder"
import { getLogger } from "../../../server/Logger"

const TABLE = `${process.env.DYNAMODB_ENV}_seguro_pet_adesao`

const log = getLogger("PetProposalRepository")

@injectable()
export class PetProposalRepository {
    constructor(
        @inject("DynamoHolder")
        private dynamoHolder: DynamoHolder
    ) {}

    async create(proposal: any) {
        try {
            log.debug("TRYING TO WRITE ON", TABLE)
            const dynamoDocClient = await this.dynamoHolder.getDynamoDocClient()
            const params = { TableName: TABLE, Item: proposal }
            await dynamoDocClient.put(params).promise()
            log.debug("REGISTER WROTE ON", TABLE)
            return proposal
        } catch (e: any) {
            log.error(e)
        }
    }

    async update(proposal) {
        const dynamoDocClient = await this.dynamoHolder.getDynamoDocClient()
        const params = {
            TableName: TABLE,
            Item: proposal,
        }
        await dynamoDocClient.put(params).promise()
        return proposal
    }
}
