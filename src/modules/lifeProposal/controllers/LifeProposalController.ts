import { inject, injectable } from "inversify"
import { Route, SuccessResponse, Response, Post, Body } from "tsoa"
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
        log.info("HealthCare Cotation")
        try {
            return await this.lifeProposalService.proposal(signedPayment.signedPayment)
        } catch (e) {
            log.error(e.message)
            throw new ApiError("HealthCare Cotation Not sent", 500)
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
    @SuccessResponse("200", "Retrieved")
    @Post("/luck_number")
    public async luckNumber() {
        log.info("Get First Luck Number")
        try {
            return await this.lifeProposalService.luckNumber()
        } catch (e) {
            log.error(e.message)
            throw new ApiError("First Luck Number Not sent", 500)
        }
    }
}
