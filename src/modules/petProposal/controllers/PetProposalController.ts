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
import { PetProposalService } from "../services/PetProposalService";

const logger = getLogger("PetController");

@Route("/v1/pet")
@injectable()
export class PetProposalController {
    constructor(
        @inject("PetProposalService") private petService: PetProposalService
    ) {}

    @Response(404, "NotFound")
    @SuccessResponse("200", "Retrieved")
    @Get("/planList")
    public async petList() {
        logger.info("Get Pet List");
        try {
            return await this.petService.listPlans();
        } catch (e) {
            logger.error(e.message);
            throw new ApiError("List Pets Not sent", 500);
        }
    }

    @Response(404, "NotFound")
    @SuccessResponse("200", "Retrieved")
    @Get(`/petDescPlan/{idPlan}`)
    public async descPetList(@Path() idPlan: string) {
        logger.info("Get Desc Plan");
        try {
            return await this.petService.descPlans(idPlan);
        } catch (e) {
            logger.error(e.message);
            throw new ApiError("Desc Plans Not sent", 500);
        }
    }
}
