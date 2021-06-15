import {injectable, inject} from "inversify";
import {DynamoHolder} from "../../../repository/DynamoHolder";
import {getLogger} from "../../../server/Logger";
import { PetSoldProposal } from "../model/PetSoldProposal";
import {Tenants} from "../../default/model/Tenants";

const TABLE = `${process.env.DYNAMODB_ENV}_sold_proposal`;

const log = getLogger("PetSoldProposalRepository")

@injectable()
export class PetSoldProposalRepository {
    static TABLE = TABLE
    constructor(
        @inject("DynamoHolder")
        private dynamoHolder: DynamoHolder
    ) {
    }
    async create(soldProposal: PetSoldProposal) {
        log.debug('TRYING TO WRITE ON', TABLE);
        let dynamoDocClient = await this.dynamoHolder.getDynamoDocClient();        
        dynamoDocClient.put({TableName: TABLE, Item: soldProposal}).promise();
        console.log('REGISTER WROTE ON', TABLE);
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
            return result.Items?.filter(x => x.tenant === Tenants.PET)
        } catch (e) {
            log.error(`Error on searching results from ${TABLE}`)
            log.error(e)
            return []
        }
    }
}
