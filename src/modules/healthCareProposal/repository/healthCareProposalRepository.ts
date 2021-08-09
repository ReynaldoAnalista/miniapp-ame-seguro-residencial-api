import { inject, injectable } from "inversify"
import moment from "moment"
import { DynamoHolder } from "../../../repository/DynamoHolder"
import { getLogger } from "../../../server/Logger"
import { AuthTokenService } from "../../authToken/services/AuthTokenService"
import { RequestService } from "../../authToken/services/RequestService"
import { Tenants } from "../../default/model/Tenants"

const TABLE = `${process.env.DYNAMODB_ENV}_rede_mais_saude_adesao`

const log = getLogger("healthCareProposalRepository")

@injectable()
export class healthCareProposalRepository {
    static TABLE = TABLE

    constructor(
        @inject("DynamoHolder")
        private dynamoHolder: DynamoHolder
    ) {}

    async create(proposal: any) {
        const dynamoDocClient = await this.dynamoHolder.getDynamoDocClient()
        const params = { TableName: TABLE, Item: proposal }
        await dynamoDocClient.put(params).promise()
        log.info("Salvando os registros na tabela rede_mais_saude_adesao")
        return proposal
    }
}
