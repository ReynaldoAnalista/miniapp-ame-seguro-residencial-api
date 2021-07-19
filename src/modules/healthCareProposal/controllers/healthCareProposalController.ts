import { inject, injectable } from "inversify"
import { Route, SuccessResponse, Response, Post, Body } from "tsoa"
import { getLogger } from "../../../server/Logger"
import { ApiError } from "../../../errors/ApiError"
import { healthCareProposalService } from "../services/healthCareProposalService"
import { HealthCareProposalNotification } from "../model/HealthCareProposalNotification"

const log = getLogger("healthCareProposalController")

@Route("/v1/healthcare")
@injectable()
export class healthCareProposalController {
    constructor(@inject("healthCareProposalService") private healthCareProposalService: healthCareProposalService) {}

    @Response(404, "NotFound")
    @SuccessResponse("200", "Retrieved")
    @Post("/sendProposal")
    public async sendProposal(@Body() proposal: HealthCareProposalNotification) {
        log.info("Post HealthCare Proposal Service")
        try {
            return await this.healthCareProposalService.proposal(proposal.signedPayment)
        } catch (e) {
            log.error(e.message)
            throw new ApiError("Life Model Not sent", 500)
        }
    }
}
