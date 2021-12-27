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

    async findFirstLuckNumber() {
        const params = {
            TableName: TABLE,
            IndexName: "keyRegisterIndex",
            KeyConditionExpression: "keyRegister = :keyRegister",
            ExpressionAttributeValues: {
                ":keyRegister": "A01",
            },
        }
        const dynamoDocClient = await this.dynamoHolder.getDynamoDocClient()
        const result = await dynamoDocClient.query(params).promise()
        return result.Items?.filter((x) => x.used == false).shift()
    }

    async setUsedLuckNumber(proposal: any, luckNumberInfo: any) {
        const dynamoDocClient = await this.dynamoHolder.getDynamoDocClient()
        const params = {
            TableName: TABLE,
            Key: {
                id: luckNumberInfo.id,
                keyRegister: "A01",
            },
            UpdateExpression: "set #variavelUsed = :y, #variavelCpf = :z",
            ExpressionAttributeNames: {
                "#variavelUsed": "used",
                "#variavelCpf": "cpf",
            },
            ExpressionAttributeValues: {
                ":y": true,
                ":z": proposal.insured.cpf,
            },
        }
        await dynamoDocClient.update(params).promise()
        log.info(`Atualizando os registros de LuckNumber para true na tabela ${TABLE}`)
        return proposal
    }
}
