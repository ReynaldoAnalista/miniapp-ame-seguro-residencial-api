import {inject, injectable} from "inversify"
import {TransactionsService} from "../services/TransactionsService"
import {Get, Path, Route, SuccessResponse, Security} from "tsoa"
import {getLogger} from "../../../server/Logger"

const log = getLogger("TransactionController")

@Route('/v1/transactions')
@injectable()
export class TransactionsController {
    constructor(
        @inject("TransactionsService") private transactionsService: TransactionsService,
    ) {
    }
    /**
     * Busca de transações por telefone
     * @param phone
     */
    @SuccessResponse("200","Retrieved")
    @Security("jwt")
    @Get("/{ddd}/{phone}")
    public async retrieveTransactions( @Path() ddd:string, @Path() phone:string) {
        log.debug('retrieveTransactions');
        return await this.transactionsService.retrieveTransactions(ddd, phone);
    }

}