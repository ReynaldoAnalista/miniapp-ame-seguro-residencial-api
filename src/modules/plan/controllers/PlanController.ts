import {inject, injectable} from "inversify"
import {PlanService} from "../services/PlanService"
import {Get, Path, Route, SuccessResponse, Response, Post, Body, Security} from "tsoa"
import {getLogger} from "../../../server/Logger"
import {ApiError} from "../../../errors/ApiError";
import {AmeNotification} from "../model/AmeNotification";

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
    public async sendProposal(@Body() signedPayment: AmeNotification) {
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

    @Get("/proposal/report")
    @Security("jwt", ["list_proposal"])
    public async proposalReport() {
        logger.info('Relatório de vendas')
        const proposalReport = await this.planService.proposalReport()
        let response = 'Nome;Email;ID Plano;Parcelamento;Vencimento;Início Vigência; Horário Servidor'
        response += proposalReport.map(p => {
            return `${p.nome};${p.email};${p.planoId};${p.numeroParcelas};${p.dataVencimento};${p.dataVencimento};${p.horarioServidor}`
        }).join('\n')
        return response
    }
}
