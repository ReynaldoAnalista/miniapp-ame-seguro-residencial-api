import {injectable, inject} from "inversify";
import {DynamoHolder} from "../../../repository/DynamoHolder";
import {getLogger} from "../../../server/Logger";
import { PetSoldProposal } from "../model/PetSoldProposal";

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
}
