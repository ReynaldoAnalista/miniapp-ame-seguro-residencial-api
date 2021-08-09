import { inject, injectable } from "inversify"
import { DynamoHolder } from "../../../repository/DynamoHolder"
import { getLogger } from "../../../server/Logger"
import { Tenants } from "../../default/model/Tenants"
import { SoldProposalStatus } from "../../default/model/SoldProposalStatus"

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
        log.info("Salvando os registros HealthCare na tabela soldProposal")
        return proposal
    }

    async cancel(proposal: any, customerId) {
        const getOrderInfo = await this.findByCustomerId(customerId)
        const getProposal = getOrderInfo?.map((item) => {
            return item
        })[0]
        let cancelProposal: any

        cancelProposal = getProposal
        cancelProposal.canceledReceived = proposal
        cancelProposal.order = getProposal?.order
        cancelProposal.customerId = getProposal?.customerId
        cancelProposal.status = SoldProposalStatus.cancel

        const dynamoDocClient = await this.dynamoHolder.getDynamoDocClient()
        const params = { TableName: TABLE, Item: cancelProposal }
        await dynamoDocClient.put(params).promise()
        log.info("Atualizando os registros de HealthCare na tabela soldProposal")
        return proposal
    }

    async findByCustomerId(customerId) {
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
            return result.Items?.filter((x) => x.tenant === Tenants.HEALTHCARE)
        } catch (e) {
            log.error(`Error on searching results from ${TABLE}`)
            log.error(e)
            return []
        }
    }
}
