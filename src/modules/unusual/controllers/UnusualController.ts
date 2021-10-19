import { inject, injectable } from "inversify"
import { Path, Route, SuccessResponse, Response, Post, Get } from "tsoa"
import { ApiError } from "../../../errors/ApiError"
import { getLogger } from "../../../server/Logger"
import { SmartphoneProposalService } from "../../smartphoneProposal/services/SmartphoneProposalService"
import { UnusualService } from "../services/UnusualService"
import { UnusualNotification } from "../model/UnusualNotification"

const logger = getLogger("UnusualController")

@Route("/v1/unusual")
@injectable()
export class UnusualController {
    constructor(
        @inject("UnusualService")
        private unusualService: UnusualService,
        @inject("SmartphoneProposalService")
        private smartphoneProposalService: SmartphoneProposalService
    ) {}

    @Response(404, "NotFound")
    @SuccessResponse("200", "Retrieved")
    @Get("/proposal_email/{pass}/{email}/sendEmail")
    public async sendMailProposalWithParams(@Path() pass: string, email: string) {
        try {
            logger.info("E-mail com o id de compra:", pass)
            await this.unusualService.sendSellingEmailWithParams(pass, email)
        } catch (e) {
            logger.error(e.message)
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
    @Get("/insert_dynamo")
    public async insertDynamo(@Path() info: UnusualNotification) {
        logger.info("Insert into DynamoDb Storage SoldProposal")
        try {
            return await this.unusualService.insertSoldProposal(info.signedInfo)
        } catch (e) {
            logger.error(e.message)
            throw new ApiError("Update not sent", 500, `Update not sent`)
        }
    }
}
