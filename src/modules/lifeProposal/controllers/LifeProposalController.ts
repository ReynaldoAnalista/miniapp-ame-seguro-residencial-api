import { inject, injectable } from "inversify"
import { Route, SuccessResponse, Response, Post, Body, Path, Get } from "tsoa"
import { getLogger } from "../../../server/Logger"
import { ApiError } from "../../../errors/ApiError"
import { LifeProposalService } from "../services/LifeProposalService"
import { LifeProposalNotification } from "../model/LifeProposalNotification"

const log = getLogger("LifeController")

@Route("/v1/life")
@injectable()
export class LifeProposalController {
    constructor(@inject("LifeProposalService") private lifeProposalService: LifeProposalService) {}

    @Response(404, "NotFound")
    @SuccessResponse("200", "Retrieved")
    @Post("/sendProposal")
    public async proposal(@Body() signedPayment: LifeProposalNotification) {
        log.info("Life Send Proposal")
        try {
            return await this.lifeProposalService.proposal(signedPayment.signedPayment)
        } catch (e) {
            log.error(e.message)
            throw new ApiError("Life Proposal Not sent", 500)
        }
    }

    @Response(404, "NotFound")
    @SuccessResponse("200", "Retrieved")
    @Post("/plan_info")
    public async planInfo(@Body() request: any) {
        log.info("Life Plan Info")
        try {
            return await this.lifeProposalService.planInfo(request)
        } catch (e) {
            log.error(e.message)
            throw new ApiError("Life Plan Info Not sent", 500)
        }
    }

    @Response(404, "NotFound")
    @SuccessResponse("200", "Retrieved")
    @Post("/cotation")
    public async cotation(@Body() request: any) {
        log.info("HealthCare Cotation")
        try {
            return await this.lifeProposalService.cotation(request)
        } catch (e) {
            log.error(e.message)
            throw new ApiError("HealthCare Cotation Not sent", 500)
        }
    }

    @Response(404, "NotFound")
    @SuccessResponse("200", "Retrived")
    @Get("/validate_customer/{customerId}")
    public async validateCustomer(@Path() customerId: any) {
        try {
            return await this.lifeProposalService.validateCustomerService(customerId)
        } catch (e) {
            log.error(e.message, "Register consult error")
            throw new ApiError("Life Validate Customer Not sent", 500)
        }
    }
}
