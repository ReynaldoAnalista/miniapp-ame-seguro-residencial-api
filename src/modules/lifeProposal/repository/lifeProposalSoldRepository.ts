import { inject, injectable } from "inversify"
import { DynamoHolder } from "../../../repository/DynamoHolder"
import { getLogger } from "../../../server/Logger"
import { Tenants } from "../../default/model/Tenants"

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

    async findAllFromInsuredId(insuredId: any) {
        try {
            const params = {
                TableName: TABLE,
                IndexName: "insuredIdIndex",
                KeyConditionExpression: "insuredId = :insuredId",
                ExpressionAttributeValues: {
                    ":insuredId": insuredId,
                },
            }
            const dynamoDocClient = await this.dynamoHolder.getDynamoDocClient()
            const result = await dynamoDocClient.query(params).promise()
            log.debug(`Have found ${result.Items?.length} items`)
            return result.Items
        } catch (e) {
            log.error(`Error on searching results from ${TABLE}`)
            log.error(e)
            return []
        }
    }

    async findAllFromStatusApproved() {
        try {
            const params = {
                TableName: TABLE,
                IndexName: "tenantIndex",
                KeyConditionExpression: "tenant = :tenant",
                ExpressionAttributeValues: {
                    ":tenant": "LIFE",
                },
            }
            const dynamoDocClient = await this.dynamoHolder.getDynamoDocClient()
            const result = await dynamoDocClient.query(params).promise()
            log.debug(`Have found ${result.Items?.length} items`)
            return result.Items?.filter((x) => x.status === "APROVED")
        } catch (e) {
            log.error(`Error on searching results from ${TABLE}`)
            log.error(e)
            return []
        }
    }

    async findAllFromCustomer(customerId: string) {
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
            return result.Items?.filter((x) => x.tenant === Tenants.LIFE && x?.status != "CANCELED")
        } catch (e) {
            log.error(`Error on searching results from ${TABLE}`)
            log.error(e)
            return []
        }
    }

    async update(proposal: any, status = "APROVED") {
        try {
            const dynamoDocClient = await this.dynamoHolder.getDynamoDocClient()
            let params
            if (typeof proposal.policyNumber != "undefined") {
                params = {
                    TableName: TABLE,
                    Key: {
                        order: proposal.order,
                        customerId: proposal.customerId,
                    },
                    UpdateExpression: "set #variavelStatus = :y, #variavelPolicy = :policy",
                    ExpressionAttributeNames: {
                        "#variavelStatus": "status",
                        "#variavelPolicy": "policy_number",
                    },
                    ExpressionAttributeValues: {
                        ":y": status,
                        ":policy": proposal?.policyNumber,
                    },
                }
            } else {
                params = {
                    TableName: TABLE,
                    Key: {
                        order: proposal.order,
                        customerId: proposal.customerId,
                    },
                    UpdateExpression: "set #variavelStatus = :y",
                    ExpressionAttributeNames: {
                        "#variavelStatus": "status",
                    },
                    ExpressionAttributeValues: {
                        ":y": status,
                    },
                }
            }
            const updateData = await dynamoDocClient.update(params).promise()
            log.info("Atualizando os registros Life na tabela soldProposal")
            return updateData
        } catch (e) {
            log.error(e, "Erro ao atualizar os valores na soldProposal")
        }
    }
}
