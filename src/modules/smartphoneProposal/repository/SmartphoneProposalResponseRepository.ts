import { injectable, inject } from "inversify"
import { DynamoHolder } from "../../../repository/DynamoHolder"
import { getLogger } from "../../../server/Logger"

const TABLE = `${process.env.DYNAMODB_ENV}_seguro_celular_response`

const log = getLogger("SmartphoneProposalResponseRepository")

@injectable()
export class SmartphoneProposalResponseRepository {
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
                        id: "a",
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
        log.debug("TRYING TO WRITE ON", TABLE)
        const dynamoDocClient = await this.dynamoHolder.getDynamoDocClient()
        const params = { TableName: TABLE, Item: proposal }
        await dynamoDocClient.put(params).promise()
        log.debug("REGISTER WROTE ON", TABLE)
        return proposal
    }

    async findByID(id: string) {
        const params = {
            TableName: TABLE,
            Key: {
                id: id,
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
                FilterExpression: "attribute_exists(id)",
            })
            .promise()
        if (scanResult.Count && scanResult.Items && scanResult.Items.length) return scanResult.Items
        else return []
    }
}
