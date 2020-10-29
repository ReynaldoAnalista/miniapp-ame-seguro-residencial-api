import {inject, injectable} from "inversify"
import {PlanService} from "../services/PlanService"
import {Get, Path, Route, SuccessResponse, Response, Post, Body} from "tsoa"
import {getLogger} from "../../../server/Logger"
import {ApiError} from "../../../errors/ApiError";
import {Proposal} from "../model/Proposal";

const logger = getLogger("PlanController")

@Route('/v1/plans')
@injectable()
export class PlanController {
    constructor(
        @inject("PlanService") private planService: PlanService,
    ) {
    }

    @Response(404, 'NotFound')
    @SuccessResponse("200", "Retrieved")
    @Get("/{zipCode}/{buildType}")
    public async retrievePlans(@Path() zipCode: string, @Path() buildType: string) {
        logger.debug(`Plans request starting for zipCode=${zipCode}`);
        const result: any = await this.planService.retrievePlanList(buildType, zipCode)
        if (result.length === 0) {
            throw new ApiError("Nothing to show", 404, `Plans not found`)
        }
        logger.debug("Plans request ended")
        return result
    }

    @Response(404, 'NotFound')
    @SuccessResponse("200", "Retrieved")
    @Post("/sendProposal")
    public async sendProposal(@Body() proposal: any) {
        logger.info('Sending Proposal %j', proposal);

        // colocando na raiz para servir de chave no DynamoDB
        proposal.email = proposal.attributes?.customPayload?.userData?.email
        const proposalResponse: any = await this.planService.sendProposal(proposal)
        logger.debug("Proposal sent %j", proposal)
        return proposalResponse
    }
}
