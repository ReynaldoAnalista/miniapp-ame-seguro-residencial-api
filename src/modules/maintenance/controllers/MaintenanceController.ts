import { inject, injectable } from "inversify"
import { Path, Route, SuccessResponse, Response, Post, Get, Body } from "tsoa"
import { ApiError } from "../../../errors/ApiError"
import { getLogger } from "../../../server/Logger"
import { ResidentialProposalService } from "../../residentialProposal/services/ResidentialProposalService"
import { SmartphoneProposalService } from "../../smartphoneProposal/services/SmartphoneProposalService"
import { MaintenanceProposalNotification } from "../model/MaintenanceProposalNotification"
import { MaintenanceService } from "../services/MaintenanceService"

const logger = getLogger("MaintenanceController")

@Route("/v1/maintenance")
@injectable()
export class MaintenanceController {
    constructor(
        @inject("MaintenanceService")
        private maintenanceService: MaintenanceService,
        @inject("SmartphoneProposalService")
        private smartphoneProposalService: SmartphoneProposalService,
        @inject("ResidentialProposalService")
        private residentialProposalService: ResidentialProposalService
    ) {}

    @Response(404, "NotFound")
    @SuccessResponse("200", "Retrieved")
    @Get("/proposal_email/{pass}/{email}/sendEmail")
    public async sendMailProposalWithParams(@Path() pass: string, @Path() email: string) {
        try {
            logger.info("E-mail com o id de compra:", pass)
            return await this.maintenanceService.sendSellingEmailWithParams(pass, email)
        } catch (e) {
            logger.error(e.message)
            throw new ApiError("Send email error", 500, `Send email error`)
        }
    }

    @Response(404, "NotFound")
    @SuccessResponse("200", "Retrieved")
    @Get("/update_old_clients/{proposalId}")
    public async updateProposal(@Path() proposalId: string) {
        logger.info("Proposal Id %j", proposalId)
        try {
            return await this.smartphoneProposalService.updateOldCustumersProposal(proposalId)
        } catch (e) {
            logger.error(e.message)
            throw new ApiError("Update not sent", 500, `Update not sent`)
        }
    }

    @Response(404, "NotFound")
    @SuccessResponse("200", "Retrieved")
    @Post("/update-plan-type")
    public async updatePlanType(@Body() proposal: string) {
        logger.info("Update Plan Type Active or Canceled")
        try {
            return await this.maintenanceService.updateOrdersType(proposal)
        } catch (e) {
            logger.error(e.message)
            throw new ApiError("Update not sent", 500, `Update not sent`)
        }
    }

    @Response(404, "NotFound")
    @SuccessResponse("200", "Retrieved")
    @Post("/residential-resend-proposal")
    public async residentialResendProposal(@Body() proposal: MaintenanceProposalNotification) {
        logger.info("Update Plan Type Active or Canceled")
        try {
            return await this.residentialProposalService.resendResidentialProposal(proposal.proposal)
        } catch (e) {
            logger.error(e.message)
            throw new ApiError("Residential Update not sent", 500, `Residential Update not sent`)
        }
    }
}
