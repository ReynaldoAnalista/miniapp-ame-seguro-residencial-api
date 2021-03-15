import {inject, injectable} from "inversify"
import {Path, Route, SuccessResponse, Response, Post } from "tsoa"
import {getLogger} from "../../../server/Logger"
import { UnusualService } from "../services/UnusualService"

const logger = getLogger("UnusualController")

@Route('/unusual')
@injectable()
export class UnusualController {

    constructor(        
        @inject("UnusualService") 
        private unusualService: UnusualService,
    ) {
    }
    
    @Response(404, 'NotFound')
    @SuccessResponse("200", "Retrieved")
    @Post("/proposal_email/{pass}/{email}/sendEmail")
    public async sendMailProposalWithParams(@Path() pass: string, email: string) {
        try {
            logger.info('E-mail com o id de compra:', pass)
            await this.unusualService.sendSellingEmailWithParams(pass, email)
        } catch (e) {
            logger.error(e.message)
        }
    }
}