import {injectable, inject} from "inversify";
import {DynamoHolder} from "../../../repository/DynamoHolder";
import {getLogger} from "../../../server/Logger";
import {SmartphoneSoldProposal} from "../model/SmartphoneSoldProposal";
import {Tenants} from "../../default/model/Tenants";

const TABLE = `${process.env.DYNAMODB_ENV}_sold_proposal`;

const log = getLogger("SmartphoneSoldProposalRepository")

@injectable()
export class SmartphoneSoldProposalRepository {

    static TABLE = TABLE

    constructor(
        @inject("DynamoHolder")
        private dynamoHolder: DynamoHolder
    ) {
    }

    async checkTable() {
        log.debug(`Checking table: ${TABLE}`)
        try {
            let dynamoDocClient = await this.dynamoHolder.getDynamoDocClient();
            await dynamoDocClient.get({
                TableName: TABLE,
                Key: {
                    "customerId": "a"
                }
            }).promise();
            return true
        } catch (e) {
            log.error(`Table ${TABLE} not exists`)
            log.error(e)
        }
        return false
    }

    async findcertificateNumber(certificateNumber: any) {
        let listProposal = await this.listSoldProposal()        
        return listProposal.map(element => {
            if(certificateNumber.includes(element.control_data.control_data.key_contract_certificate_number)) {
                return {
                    key_contract_certificate_number: element.control_data.control_data.key_contract_certificate_number,
                    customerId : element.customerId
                } 
            }
        }).filter(element => { return element != null });
    }

    async create(soldProposal: SmartphoneSoldProposal) {
        log.debug('TRYING TO WRITE ON', TABLE);
        let dynamoDocClient = await this.dynamoHolder.getDynamoDocClient();
        let params = {TableName: TABLE, Item: soldProposal};
        await dynamoDocClient.put(params).promise();
        log.debug('REGISTER WROTE ON', TABLE);
        return soldProposal
    }
    
    async update(soldProposal: any) {
        log.debug('TRYING UPDATE ON', TABLE);                
        let dynamoDocClient = await this.dynamoHolder.getDynamoDocClient();        
        let params = {TableName: TABLE, Item: soldProposal};
        await dynamoDocClient.put(params).promise();
        log.debug('UPDATED ON', TABLE);
        return soldProposal
    }   

    async findAllFromCustomer(customerId: string) {
        log.debug(`Searching for Proposals in Table: ${TABLE}, customerId: ${customerId}`)
        let params = {
            TableName: TABLE,
            KeyConditionExpression: "#customerId = :customerId",
            ExpressionAttributeNames: {
                "#customerId": "customerId"
            },
            ExpressionAttributeValues: {
                ":customerId": customerId
            }
        };
        try {
            let dynamoDocClient = await this.dynamoHolder.getDynamoDocClient();
            let result = await dynamoDocClient.query(params).promise();
            log.debug(`Have found ${result.Items?.length} items`)
            return result.Items?.filter(x => x.tenant === Tenants.SMARTPHONE)
        } catch (e) {
            log.error(`Error on searching results from ${TABLE}`)
            log.error(e)
            return []
        }
    }

    async listSoldProposal() {
        let dynamoDocClient = await this.dynamoHolder.getDynamoDocClient();
        let scanResult = await dynamoDocClient.scan({
            TableName: TABLE,
            FilterExpression: 'attribute_exists(customerId)'
        }).promise()
        if (scanResult.Count && scanResult.Items && scanResult.Items.length)
            return scanResult.Items
        else
            return []
    }
    
    async findAllFromCustomerAndOrder(customerId: string, order: string) {        
        let params = {
            TableName: TABLE,
            KeyConditionExpression: "#customerId = :customerId AND #order = :order",
            ExpressionAttributeNames: {
                "#customerId": "customerId",
                "#order": "order",
            },
            ExpressionAttributeValues: {
                ":customerId": customerId,
                ":order": order
            }
        };        
        try {
            let dynamoDocClient = await this.dynamoHolder.getDynamoDocClient();
            let result = await dynamoDocClient.query(params).promise();
            log.debug(`Have found ${result.Items?.length} items`)
            return result.Items?.filter(x => x.tenant === Tenants.SMARTPHONE)
        } catch (e) {
            log.error(`Error on searching results from ${TABLE}`)
            log.error(e)
            return []
        }
    }

    /**
     * Este método é utilizado apenas durante os testes
     */
    async deleteByCustomerAndOrder(customerId: string, order: string) {
        log.debug(`Deleting customerId=${customerId} AND order=${order}`)
        let dynamoDocClient = await this.dynamoHolder.getDynamoDocClient();
        let params = {
            TableName: TABLE,
            Key: {
                "customerId": customerId,
                "order": order
            },
        };
        await dynamoDocClient.delete(params).promise();
    }

}
