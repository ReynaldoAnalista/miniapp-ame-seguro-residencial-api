import { inject, injectable } from "inversify"
import { Route, SuccessResponse, Response, Post, Body } from "tsoa"
import { getLogger } from "../../../server/Logger"
import { ApiError } from "../../../errors/ApiError"
import { HealthCareProposalService } from "../services/healthCareProposalService"
import { HealthCareProposalNotification } from "../model/HealthCareProposalNotification"

const log = getLogger("healthCareProposalController")

@Route("/v1/healthcare")
@injectable()
export class healthCareProposalController {
    constructor(@inject("HealthCareProposalService") private healthCareProposalService: HealthCareProposalService) {}

    @Response(404, "NotFound")
    @SuccessResponse("200", "Retrieved")
    @Post("/sendProposal")
    public async sendProposal(@Body() signedPayment: HealthCareProposalNotification) {
        log.info("Post HealthCare Proposal Service")
        try {
            return await this.healthCareProposalService.proposal(signedPayment.signedPayment)
        } catch (e: any) {
            log.error(e.message)
            throw new ApiError("HealthCare Model Not sent", 500)
        }
    }

    @Response(404, "NotFound")
    @SuccessResponse("200", "Retrieved")
    @Post("/cancelProposal")
    public async cancelProposal(@Body() request: any) {
        log.info("Post HealthCare Proposal Cancel")
        try {
            return await this.healthCareProposalService.cancel(request)
        } catch (e: any) {
            log.error(e.message)
            throw new ApiError("HealthCare Cancel Not sent", 500)
        }
    }
}
