import { inject, injectable } from "inversify"
import { Route, SuccessResponse, Response, Post, Body } from "tsoa"
import { getLogger } from "../../../server/Logger"
import { ApiError } from "../../../errors/ApiError"
import { LifeProposalService } from "../services/LifeProposalService"

const logger = getLogger("LifeController")

@Route("/v1/life")
@injectable()
export class LifeProposalController {
    constructor(@inject("LifeProposalService") private lifeProposalService: LifeProposalService) {}

    @Response(404, "NotFound")
    @SuccessResponse("200", "Retrieved")
    @Post("/cotation")
    public async cotationPlan(@Body() cotation: any) {
        logger.info("Get Life Cotation")
        try {
            return await this.lifeProposalService.cotation(cotation)
        } catch (e) {
            logger.error(e.message)
            throw new ApiError("Life Model Not sent", 500)
        }
    }

    @Response(404, "NotFound")
    @SuccessResponse("200", "Retrieved")
    @Post("/luck_number")
    public async luckNumber() {
        logger.info("Get First Luck Number")
        try {
            return await this.lifeProposalService.luckNumber()
        } catch (e) {
            logger.error(e.message)
            throw new ApiError("First Luck Number Not sent", 500)
        }
    }
}
