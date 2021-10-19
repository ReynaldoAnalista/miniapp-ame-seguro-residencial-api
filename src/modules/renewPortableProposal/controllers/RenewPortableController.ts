import { injectable, inject } from "inversify"
import { Get, Post, Route, Response, SuccessResponse, Path, Body } from "tsoa"
import { getLogger } from "../../../server/Logger"
import { RenewPortableProposalNotification } from "../model/PetProposalNotification"
import { RenewPortableService } from "../services/RenewPortableService"

const logger = getLogger("RenewPortableController")

@Route("/v1/renew-portable")
@injectable()
export class RenewPortableController {
    constructor(@inject("RenewPortableService") private renewPortableService: RenewPortableService) {}

    @Response(404, "NotFound")
    @SuccessResponse("200", "Retrieved")
    @Get("/portable-info/{customerId}")
    public async portableInfo(@Path() customerId: string) {
        try {
            logger.info("Buscando equipamentos portateis cadastrados para o usuário")
            const showUserInfo = await this.renewPortableService.showUserInfo(customerId)
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
}
