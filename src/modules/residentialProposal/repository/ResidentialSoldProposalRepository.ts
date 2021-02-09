import {injectable, inject} from "inversify";
import {DynamoHolder} from "../../../repository/DynamoHolder";
import {getLogger} from "../../../server/Logger";
import {ResidentialSoldProposal} from "../model/ResidentialSoldProposal";

const TABLE = `${process.env.DYNAMODB_ENV}_sold_proposal`;

const log = getLogger("ResidentialSoldProposalRepository")

@injectable()
export class ResidentialSoldProposalRepository {

    static TABLE = TABLE

    constructor(
        @inject("DynamoHolder")
        private dynamoHolder: DynamoHolder
    ) {
    }

    async create(soldProposal: ResidentialSoldProposal) {
        log.debug('TRYING TO WRITE ON', TABLE);
        let dynamoDocClient = await this.dynamoHolder.getDynamoDocClient();
        let params = {TableName: TABLE, Item: soldProposal};
        await dynamoDocClient.put(params).promise();
        log.debug('REGISTER WROTE ON', TABLE);
        return soldProposal
    }

    async findByCustomerId(id: string) {
        let params = {
            TableName: TABLE,
            Key: {
                "customerId": id
            }
        };
        let dynamoDocClient = await this.dynamoHolder.getDynamoDocClient();
        let result = await dynamoDocClient.get(params).promise();
        if (!result.Item) throw new Error("not found")
        return result.Item
    }

}
