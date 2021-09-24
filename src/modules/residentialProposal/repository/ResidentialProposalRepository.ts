import { injectable, inject } from "inversify"
import { DynamoHolder } from "../../../repository/DynamoHolder"
import { getLogger } from "../../../server/Logger"

const TABLE = `${process.env.DYNAMODB_ENV}_seguro_residencial`

const log = getLogger("ResidentialProposalRepository")

@injectable()
export class ResidentialProposalRepository {
    static TABLE = TABLE

    constructor(
        @inject("DynamoHolder")
        private dynamoHolder: DynamoHolder
    ) {}

    async checkTable() {
        log.debug(`Checking table: ${TABLE}`)
        try {
            const dynamoDocClient = await this.dynamoHolder.getDynamoDocClient()
            await dynamoDocClient
                .get({
                    TableName: TABLE,
                    Key: {
                        email: "a",
                    },
                })
                .promise()
            return true
        } catch (e) {
            log.error(`Table ${TABLE} not exists`)
            log.error(e)
        }
        return false
    }

    async create(proposal: any) {
        const dynamoDocClient = await this.dynamoHolder.getDynamoDocClient()
        const params = { TableName: TABLE, Item: proposal }
        await dynamoDocClient.put(params).promise()
        return proposal
    }

    async findByEmail(email: string) {
        const params = {
            TableName: TABLE,
            Key: {
                email: email,
            },
        }
        const dynamoDocClient = await this.dynamoHolder.getDynamoDocClient()

        const result = await dynamoDocClient.get(params).promise()
        return result.Item
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

    async listProposal() {
        const dynamoDocClient = await this.dynamoHolder.getDynamoDocClient()
        const scanResult = await dynamoDocClient
            .scan({
                TableName: TABLE,
                FilterExpression: "attribute_exists(email)",
            })
            .promise()
        if (scanResult.Count && scanResult.Items && scanResult.Items.length) return scanResult.Items
        else return []
    }
}
