import { injectable, inject } from "inversify"
import { DynamoHolder } from "../../../repository/DynamoHolder"
import { getLogger } from "../../../server/Logger"
import { PetSoldProposal } from "../model/PetSoldProposal"
import { Tenants } from "../../default/model/Tenants"

const TABLE = `${process.env.DYNAMODB_ENV}_sold_proposal`

const log = getLogger("PetSoldProposalRepository")

@injectable()
export class PetSoldProposalRepository {
    static TABLE = TABLE
    constructor(
        @inject("DynamoHolder")
        private dynamoHolder: DynamoHolder
    ) {}
    async create(soldProposal: PetSoldProposal) {
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
            return result.Items?.filter((x) => x.tenant === Tenants.PET)
        } catch (e: any) {
            log.error(`Error on searching results from ${TABLE}`)
            log.error(e)
            return []
        }
    }
}
