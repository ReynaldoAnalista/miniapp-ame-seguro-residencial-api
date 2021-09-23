import { inject, injectable } from "inversify"
import { getLogger } from "../../../server/Logger"
import { AuthTokenService } from "../../authToken/services/AuthTokenService"
import { RequestService } from "../../authToken/services/RequestService"
import { SoldProposalStatus } from "../../default/model/SoldProposalStatus"
import { Tenants } from "../../default/model/Tenants"
import { RenewPortableSoldProposal } from "../repository/RenewPortableSoldProposal"
import { RenewPortableUtils } from "./RenewPortableUtils"

const log = getLogger("RenewPortableService")

@injectable()
export class RenewPortableService {
    constructor(
        @inject("RequestService")
        private requestService: RequestService,
        @inject("AuthTokenService")
        private authTokenService: AuthTokenService,
        @inject("RenewPortableSoldProposal")
        private renewPortableSoldProposal: RenewPortableSoldProposal,
        @inject("RenewPortableUtils")
        private renewPortableUtils: RenewPortableUtils
    ) {}

    async showUserInfo(customerId: string) {
        log.debug("Exibindo informação de portateis do usuario")
        try {
            const response = await this.requestService.makeRequest(
                this.requestService.ENDPOINTS.RENEW_PORTABLE_URL_BASE,
                this.requestService.METHODS.GET,
                null,
                Tenants.RENEW_PORTABLE,
                `/${customerId}`
            )
            return response.data
        } catch (error) {
            throw error
        }
    }

    async processProposal(signedPayment: any) {
        const unsignedPayment = await this.authTokenService.unsignNotification(signedPayment)
        log.info("Salvando o arquivo da notificação")
        const formatProposal = await RenewPortableUtils.generateProposal(unsignedPayment)
        const proposalResponse = await this.sendProposal(formatProposal)
        log.info("Sucesso no envio da Proposta")
        if (proposalResponse.success) {
            await this.createSoldProposal(unsignedPayment, proposalResponse)
            log.info("Sucesso no envio para SoldProposal")
            await this.deletePortableInfo(unsignedPayment.customPayload.proposal.extended_warranty.certificate_number)
        }
        return proposalResponse
    }

    async sendProposal(proposal: any) {
        log.debug("Sending proposal to Partner")
        let result
        try {
            const response = await this.requestService.makeRequest(
                this.requestService.ENDPOINTS.SMARTPHONE_URL_SALE,
                this.requestService.METHODS.POST,
                proposal,
                Tenants.SMARTPHONE,
                "/garantia-estendida"
            )
            result = { success: true, content: response.status }
            log.info("Success proposal sent")
        } catch (e) {
            const status = e.response?.status
            const statusText = e.response?.statusText
            result = { success: false, status: status, message: statusText }
            log.error(`Error %j`, statusText)
            log.debug("Error when trying to send proposal")
            log.debug(`Status Code: ${status}`)
        }

        return result
    }

    async deletePortableInfo(certificateNumber: any) {
        log.debug("Excluindo equipamento renovado da base")
        let result
        try {
            const response = await this.requestService.makeRequest(
                this.requestService.ENDPOINTS.RENEW_PORTABLE_URL_BASE,
                this.requestService.METHODS.DELETE,
                null,
                Tenants.RENEW_PORTABLE,
                `/${certificateNumber}`
            )
            result = { success: true, content: response.status }
            log.debug("Equipamento excluído da base")
        } catch (e) {
            const status = e.response?.status
            const statusText = e.response?.statusText
            result = { success: false, status: status, message: statusText }
            log.error(`Error %j`, statusText)
            log.debug("Erro ao excluír o equipamento da base")
            log.debug(`Status Code: ${status}`)
        }
        return result
    }

    async createSoldProposal(proposal, response) {
        const apiVersion = process.env.COMMIT_HASH || "unavailable"
        try {
            await this.renewPortableSoldProposal.create({
                customerId: proposal.customPayload.customerId,
                order: proposal.id,
                tenant: Tenants.RENEW_PORTABLE,
                createdAt: new Date().toISOString(),
                success: true,
                partnerResponse: response,
                apiVersion,
                status: SoldProposalStatus.create,
                receivedPaymentNotification: proposal,
            })
            log.debug("saveSoldProposal:success")
        } catch (e) {
            log.debug("saveSoldProposal:Fail")
            log.error(e)
        }
    }
}
