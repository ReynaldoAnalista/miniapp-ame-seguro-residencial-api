import {inject, injectable} from "inversify"
import {Path, Route, SuccessResponse, Response, Post, Get } from "tsoa"
import { ApiError } from "../../../errors/ApiError"
import {getLogger} from "../../../server/Logger"
import { SmartphoneProposalService } from "../../smartphoneProposal/services/SmartphoneProposalService"
import { UnusualService } from "../services/UnusualService"

const logger = getLogger("UnusualController")

@Route('/unusual')
@injectable()
export class UnusualController {

    constructor(        
        @inject("UnusualService") 
        private unusualService: UnusualService,
        @inject("SmartphoneProposalService") 
        private smartphoneProposalService: SmartphoneProposalService,
    ) {
    }
    
    @Response(404, 'NotFound')
    @SuccessResponse("200", "Retrieved")
    @Get("/proposal_email/{pass}/{email}/sendEmail")
    public async sendMailProposalWithParams(@Path() pass: string, email: string) {
        try {
            logger.info('E-mail com o id de compra:', pass)
            await this.unusualService.sendSellingEmailWithParams(pass, email)
        } catch (e) {
            logger.error(e.message)
        }
    }

    @Response(404, 'NotFound')
    @SuccessResponse("200", "Retrieved")
    @Get("/update_old_clients/{proposalId}")
    public async updateProposal(@Path() proposalId: string) {
        logger.info('Proposal Id %j', proposalId);
        try {
            return await this.smartphoneProposalService.updateOldCustumersProposal(proposalId)
        } catch (e) {
            logger.error(e.message)
            throw new ApiError("Update not sent", 500, `Update not sent`)
        }
    }

        
    @Response(404, 'NotFound')
    @SuccessResponse("200", "Retrieved")
    @Post("/find_from_order_customer/{customerId}/{order}")
    public async findFromOrdeCustomer(@Path() customerId: string, order: string) {
        try {
            logger.info('Informações solicitadas de CustomerId e Order:', customerId)
            const findFromOrdeCustomer = await this.smartphoneProposalService.findFromCostumerOrder(customerId, order)
            return findFromOrdeCustomer
        } catch (e) {
            logger.error(e.message)            
        }
    }
    
    @Response(404, 'NotFound')
    @SuccessResponse("200", "Retrieved")
    @Get("/find_by_nsu/{nsu}")
    public async findByNsu(@Path() nsu: string) {
        try {            
            const findFromNsu = await this.smartphoneProposalService.findByNsu(nsu)
            return findFromNsu
        } catch (e) {
            logger.error(e.message)            
        }
    }
}