import {inject, injectable} from "inversify"
import {ResidentialProposalService} from "../services/ResidentialProposalService"
import {Get, Path, Route, SuccessResponse, Response, Request, Post, Body, Security} from "tsoa"
import {getLogger} from "../../../server/Logger"
import {ApiError} from "../../../errors/ApiError";
import {ResidentialProposalNotification} from "../model/ResidentialProposalNotification";

const logger = getLogger("PlanController")

@Route('/v1/plans')
@injectable()
export class ResidentialProposalController {
    constructor(
        @inject("PlanService") private planService: ResidentialProposalService,
    ) {
    }

    @Response(404, 'NotFound')
    @Get("/proposal-report")
    @Security("jwt", ["list_proposal"])
    public async proposalReport(@Request() request) {
        logger.info('Relatório de vendas')
        const response = (<any>request).res;
        response.contentType('text/plain');
        response
            .send((await this.planService.proposalReport()).join('\n'))
            .end();
    }

    @Response(404, 'NotFound')
    @SuccessResponse("200", "Retrieved")
    @Get("/{zipCode}/{buildType}")
    public async retrievePlans(@Path() zipCode: string, @Path() buildType: string) {
        logger.debug(`Plans request starting for zipCode=${zipCode}`);
        try {
            const result: any = await this.planService.retrievePlanList(buildType, zipCode)
            if (result.length === 0) {
                throw new ApiError("Nothing to show", 404, `Plans not found`)
            }
            return result
        } catch (e) {
            throw new ApiError("Error on retrieve plans", 404, JSON.stringify({trace: e.trace, apiStatus: e.status}))
        }
    }

    @Response(404, 'NotFound')
    @SuccessResponse("200", "Retrieved")
    @Post("/sendProposal")
    public async sendProposal(@Body() signedPayment: ResidentialProposalNotification) {
        logger.info('Sending Proposal %j', signedPayment);
        try {
            return await this.planService.processProposal(signedPayment.signedPayment)
        } catch (e) {
            logger.error(e.message)
            throw new ApiError("Plans not sent", 500, `Plans not sent`)
        }
    }

    @Get("/proposal")
    @Security("jwt", ["list_proposal"])
    public async listProposal() {
        logger.info('Listando proposal')
        const proposal = await this.planService.listProposal()
        logger.info('Retornando proposals %j', proposal.length)
        return proposal
    }

}
