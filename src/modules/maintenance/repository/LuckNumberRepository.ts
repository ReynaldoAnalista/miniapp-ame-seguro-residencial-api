import { inject, injectable } from "inversify"
import { DynamoHolder } from "../../../repository/DynamoHolder"
import { getLogger } from "../../../server/Logger"
import { LuckNumber } from "../model/LuckNumber"

const log = getLogger("LuckNumberRepository")

const TABLE = `${process.env.DYNAMODB_ENV}_seguro_vida_numero_sorte`

@injectable()
export class LuckNumberRepository {
    constructor(
        @inject("DynamoHolder")
        private dynamoHolder: DynamoHolder
    ) {}

    async create(luckNumber: LuckNumber) {
        log.debug("TRYING TO WRITE ON", TABLE)
        const dynamoDocClient = await this.dynamoHolder.getDynamoDocClient()
        const params = { TableName: TABLE, Item: luckNumber }
        await dynamoDocClient.put(params).promise()
        log.debug("REGISTER WROTE ON", TABLE)
        return luckNumber
    }

    async update(customerId: any, order: any) {
        return
    }
}
