import { injectable, inject } from "inversify"
import { Get, Post, Route, Response, SuccessResponse, Path, Body } from "tsoa"
import { getLogger } from "../../../server/Logger"
import { RenewPortableProposalNotification } from "../model/RenewPortableProposalNotification"
import { RenewPortableService } from "../services/RenewPortableService"

const logger = getLogger("RenewPortableController")

@Route("/v1/renew-portable")
@injectable()
export class RenewPortableController {
    constructor(@inject("RenewPortableService") private renewPortableService: RenewPortableService) {}

    @Response(404, "NotFound")
    @SuccessResponse("200", "Retrieved")
    @Get("/portable-info/{customerId}/{planType}")
    public async portableInfo(@Path() customerId: string, planType: string) {
        try {
            logger.info("Buscando equipamentos portateis cadastrados para o usuário")
            const showUserInfo = await this.renewPortableService.showUserInfo(customerId, planType)
            return showUserInfo
        } catch (error) {
            logger.error(`Erro ao tentar buscar as informações: ${error}`)
            throw `Erro ao obter as informações portateis de usuario ${error}`
        }
    }

    @Response(404, "NotFound")
    @SuccessResponse("200", "Retrieved")
    @Post("/sendProposal")
    public async sendProposal(@Body() proposal: RenewPortableProposalNotification) {
        try {
            logger.info("Buscando equipamentos portateis cadastrados para o usuário")
            const showUserInfo = await this.renewPortableService.processProposal(proposal.signedPayment)
            return showUserInfo
        } catch (error) {
            logger.error(`Erro ao tentar buscar as informações: ${error}`)
            throw `Erro ao enviar a requisição ${error}`
        }
    }

    @Response(404, "NotFound")
    @SuccessResponse("200", "Retrieved")
    @Post("/prize_calc")
    public async prizeCalc(@Body() infoJson: any) {
        try {
            logger.info("Buscando calculo de reembolso")
            const showUserInfo = await this.renewPortableService.prizeCalc(infoJson)
            return showUserInfo
        } catch (error) {
            logger.error(`Erro ao tentar buscar as informações: ${error}`)
            throw `Erro ao enviar a requisição ${error}`
        }
    }
}
