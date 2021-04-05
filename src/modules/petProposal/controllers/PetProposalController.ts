import {inject, injectable} from "inversify"
import {Get, Path, Route, SuccessResponse, Response, Post, Body, Security} from "tsoa"
import {getLogger} from "../../../server/Logger"
import {ApiError} from "../../../errors/ApiError";
import { PetProposalService } from "../services/PetProposalService";

const logger = getLogger("PetController")

@Route('/v1/pet')
@injectable()
export class PetProposalController {
    constructor(
        @inject("PetProposalService") private petService: PetProposalService,
    ) {
    }

    @Response(404, 'NotFound')
    @SuccessResponse("200", "Retrieved")
    @Post("/petList")
    public async sendProposal() {
        logger.info('Get Pet List');
        try {
            return await this.petService.listPlans()
        } catch (e) {
            logger.error(e.message)
            throw new ApiError("List Pets Not sent", 500)
        }
    }

}
