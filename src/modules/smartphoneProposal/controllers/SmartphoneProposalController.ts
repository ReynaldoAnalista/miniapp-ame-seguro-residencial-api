import {inject, injectable} from "inversify"
import {SmartphoneProposalService} from "../services/SmartphoneProposalService"
import {Get, Path, Route, SuccessResponse, Response, Post, Body, Security} from "tsoa"
import {getLogger} from "../../../server/Logger"
import {ApiError} from "../../../errors/ApiError";
import {SmartphoneProposalNotification} from "../model/SmartphoneProposalNotification";

const logger = getLogger("PlanController")

@Route('/v1/plans')
@injectable()
export class SmartphoneProposalController {
    constructor(
        @inject("PlanService") private planService: SmartphoneProposalService,
    ) {
    }

    @Response(404, 'NotFound')
    @SuccessResponse("200", "Retrieved")
    @Post("/sendProposal")
    public async sendProposal(@Body() signedPayment: SmartphoneProposalNotification) {
        logger.info('Sending Proposal %j', signedPayment);
        try {
            await this.planService.saveProposal(signedPayment.signedPayment)
            const proposalResponse = await this.planService.sendProposal(signedPayment.signedPayment)
            await this.planService.saveProposalResponse(proposalResponse)
        } catch (e) {
            logger.error(e.message)
            throw new ApiError("Plans not sent", 500, `Plans not sent`)
        }
    }
}
