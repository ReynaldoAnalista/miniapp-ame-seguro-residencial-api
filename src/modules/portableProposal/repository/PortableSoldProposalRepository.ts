import { injectable, inject } from "inversify"
import { DynamoHolder } from "../../../repository/DynamoHolder"
import { getLogger } from "../../../server/Logger"
import { PortableSoldProposal } from "../model/PortableSoldProposal"
import { Tenants } from "../../default/model/Tenants"
import moment from "moment"

const TABLE = `${process.env.DYNAMODB_ENV}_sold_proposal`

const log = getLogger("PortableSoldProposalRepository")

@injectable()
export class PortableSoldProposalRepository {
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
                        customerId: "a",
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

    async listSoldProposal() {
        const dynamoDocClient = await this.dynamoHolder.getDynamoDocClient()
        const scanResult = await dynamoDocClient
            .scan({
                TableName: TABLE,
                FilterExpression: "attribute_exists(customerId)",
            })
            .promise()
        if (scanResult.Count && scanResult.Items && scanResult.Items.length) return scanResult.Items
        else return []
    }

    async findcertificateNumber() {
        const listProposal = await this.listSoldProposal()
        return listProposal
            .map((element) => {
                if (element.tenant == Tenants.PORTABLE) {
                    return {
                        key_contract_certificate_number: element.control_data?.control_data?.key_contract_certificate_number,
                        customerId: element.customerId,
                    }
                }
            })
            .filter((element) => {
                return element != null
            })
    }

    async create(soldProposal: PortableSoldProposal) {
        log.debug("TRYING TO WRITE ON", TABLE)
        const dynamoDocClient = await this.dynamoHolder.getDynamoDocClient()
        const params = { TableName: TABLE, Item: soldProposal }
        await dynamoDocClient.put(params).promise()
        log.debug("REGISTER WROTE ON", TABLE)
        return soldProposal
    }

    async update(soldProposal: any) {
        log.debug("TRYING UPDATE ON", TABLE)
        const dynamoDocClient = await this.dynamoHolder.getDynamoDocClient()
        const params = { TableName: TABLE, Item: soldProposal }
        await dynamoDocClient.put(params).promise()
        log.debug("UPDATED ON", TABLE)
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
            return result.Items?.filter((x) => x.tenant === Tenants.PORTABLE)
        } catch (e) {
            log.error(`Error on searching results from ${TABLE}`)
            log.error(e)
            return []
        }
    }

    async findAllFromCustomerAndOrder(customerId: string, order: string) {
        const params = {
            TableName: TABLE,
            KeyConditionExpression: "#customerId = :customerId AND #order = :order",
            ExpressionAttributeNames: {
                "#customerId": "customerId",
                "#order": "order",
            },
            ExpressionAttributeValues: {
                ":customerId": customerId,
                ":order": order,
            },
        }
        try {
            const dynamoDocClient = await this.dynamoHolder.getDynamoDocClient()
            const result = await dynamoDocClient.query(params).promise()
            log.debug(`Have found ${result.Items?.length} items`)
            return result.Items?.filter((x) => x.tenant === Tenants.PORTABLE && x?.status != "CANCELED")
        } catch (e) {
            log.error(`Error on searching results from ${TABLE}`)
            log.error(e)
            return []
        }
    }

    async updateNsuByCustumerAndOrder(getCustomerId: string, getOrder: string) {
        const soldProposalInfo = await this.findAllFromCustomerAndOrder(getCustomerId, getOrder)
        const updateInfoTable = soldProposalInfo?.map((x) => {
            return {
                partnerResponse: x.partnerResponse,
                createdAt: x.createdAt,
                success: x.success,
                customerId: x.customerId,
                receivedPaymentNotification: x.receivedPaymentNotification,
                tenant: x.tenant,
                order: x.order,
                NSU: x.receivedPaymentNotification.nsu,
            }
        })

        return this.update(updateInfoTable?.[0])
    }

    async findByNsu(NSU: string) {
        const params = {
            TableName: TABLE,
            IndexName: "NSUIndex",
            KeyConditionExpression: "NSU = :NSU",
            ExpressionAttributeValues: {
                ":NSU": NSU,
            },
        }
        try {
            const dynamoDocClient = await this.dynamoHolder.getDynamoDocClient()
            const result = await dynamoDocClient.query(params).promise()
            log.debug(`Have found ${result.Items?.length} items`)
            return result.Items?.filter((x) => x.tenant === Tenants.PORTABLE && x?.status != "CANCELED")
        } catch (e) {
            log.error(`Error on searching results from ${TABLE}`)
            log.error(e)
        }
    }

    async formatCancelProposal(proposal: any) {
        const soldProposalInfo: any = await this.findAllFromCustomerAndOrder(proposal.customerId, proposal.order)

        if (soldProposalInfo.length == 0) {
            return false
        }

        return {
            key_certificate_number_cancellation:
                soldProposalInfo[0].receivedPaymentNotification?.attributes?.customPayload.proposal.policy_data
                    ?.key_contract_certificate_number,
            policy_item_number_canceled:
                soldProposalInfo[0].receivedPaymentNotification?.attributes?.customPayload.proposal.coverage_data
                    ?.policy_item_number,
            definitive_policy_number:
                soldProposalInfo[0].receivedPaymentNotification?.attributes?.customPayload.proposal.policy_data
                    ?.mother_policy_number,
            start_valid_policy:
                soldProposalInfo[0].receivedPaymentNotification?.attributes?.customPayload.proposal.policy_data
                    ?.start_valid_document,
            policy_end:
                soldProposalInfo[0].receivedPaymentNotification?.attributes?.customPayload.proposal.policy_data
                    ?.end_valid_document,
            cancellation_date: moment().format("MMDDYYYY"),
            cancellation_type: proposal.data.cancellation_type,
            cancellation_reason: proposal.data.cancellation_reason,
        }
    }

    /**
     * Este método é utilizado apenas durante os testes
     */
    async deleteByCustomerAndOrder(customerId: string, order: string) {
        log.debug(`Deleting customerId=${customerId} AND order=${order}`)
        const dynamoDocClient = await this.dynamoHolder.getDynamoDocClient()
        const params = {
            TableName: TABLE,
            Key: {
                customerId: customerId,
                order: order,
            },
        }
        await dynamoDocClient.delete(params).promise()
    }
}
