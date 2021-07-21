import { inject, injectable } from "inversify"
import { Get, Path, Route, SuccessResponse, Response, Post, Body, Security, Header } from "tsoa"
import { getLogger } from "../../../server/Logger"
import { ApiError } from "../../../errors/ApiError"
import { ResidentialProposalNotification } from "../model/ResidentialProposalNotification"
import { ResidentialMaintenanceService } from "../services/ResidentialMaintenanceService"

const logger = getLogger("MaintenanceController")

@Route("/v1/residential/maintenance")
@injectable()
export class MaintenanceController {
    constructor(@inject("ResidentialMaintenanceService") private residentialMaintenanceService: ResidentialMaintenanceService) {}

    @Response(404, "NotFound")
    @Get("/proposal/{paymentId}")
    public async proposalReport(@Path() paymentId: string, @Header("x-partner") partner: string) {
        logger.info("Listando informações de proposta")
        if (partner !== "c4075135-09cf-48ca-a114-1c2c425715b7") {
            throw new ApiError("Not Authorized", 403, `wrong header`)
        }
        return await this.residentialMaintenanceService.showProposalStatus(paymentId)
    }

    @Response(404, "NotFound")
    @Get("/soldProposal/{customerId}")
    public async soldProposalReport(@Path() customerId: string, @Header("x-partner") partner: string) {
        logger.info("Listando informações de proposta")
        if (partner !== "c4075135-09cf-48ca-a114-1c2c425715b7") {
            throw new ApiError("Not Authorized", 403, `wrong header`)
        }
        return await this.residentialMaintenanceService.showSoldProposalStatus(customerId)
    }

    @Response(404, "NotFound")
    @Get("/generateSoldProposal/{version}/{paymentId}/{customerId}")
    public async generateSoldProposal(
        @Path() version: string,
        @Path() paymentId: string,
        @Path() customerId: string,
        @Header("x-partner") partner: string
    ) {
        logger.info("Gerando um novo modelo de soldProposal")
        if (partner !== "c4075135-09cf-48ca-a114-1c2c425715b7") {
            throw new ApiError("Not Authorized", 403, `wrong header`)
        }
        return await this.residentialMaintenanceService.generateSoldProposal(version, paymentId, customerId)
    }
}
