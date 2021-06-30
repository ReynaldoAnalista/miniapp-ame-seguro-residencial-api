import { inject, injectable } from "inversify";
import {
    Get,
    Path,
    Route,
    SuccessResponse,
    Response,
    Post,
    Body,
    Security,
} from "tsoa";
import { getLogger } from "../../../server/Logger";
import { ApiError } from "../../../errors/ApiError";
import { LifeProposalService } from "../services/LifeProposalService";

const logger = getLogger("LifeController");

@Route("/v1/life")
@injectable()
export class LifeProposalController {
    constructor(
        @inject("LifeProposalService") private lifeProposalService: LifeProposalService
    ) {}

    @Response(404, "NotFound")
    @SuccessResponse("200", "Retrieved")
    @Get("/get_model")
    public async planList() {
        logger.info("Get Life Model");
        try {
            return await this.lifeProposalService.getProposalModel()
        } catch (e) {
            logger.error(e.message);
            throw new ApiError("Life Model Not sent", 500);
        }
    }

}
