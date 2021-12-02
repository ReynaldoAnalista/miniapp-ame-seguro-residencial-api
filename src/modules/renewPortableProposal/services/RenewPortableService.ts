import { inject, injectable } from "inversify"
import { getLogger } from "../../../server/Logger"
import { AuthTokenService } from "../../authToken/services/AuthTokenService"
import { RequestService } from "../../authToken/services/RequestService"
import { SoldProposalStatus } from "../../default/model/SoldProposalStatus"
import { Tenants } from "../../default/model/Tenants"
import { RenewPortableSoldProposal } from "../repository/RenewPortableSoldProposal"
import { RenewPortableUtils } from "./RenewPortableUtils"
import axios from "axios"

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

    async showUserInfo(customerId: string, planType: string) {
        log.debug("Exibindo informação de portateis do usuario")
        try {
            const response = await this.requestService.makeRequest(
                this.requestService.ENDPOINTS.RENEW_PORTABLE_URL_BASE,
                this.requestService.METHODS.GET,
                null,
                Tenants.RENEW_PORTABLE,
                `/${customerId}`
            )
            const data = response.data
                .filter((x) => x.type == planType)
                .map((x) => {
                    return { ...x, product: { ...x.product, base_price: parseFloat(x.product.base_price).toFixed(2) } }
                })
            return data
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

    async prizeCalc(prizeInfo: any) {
        const s3File = "https://s3.amazonaws.com/seguros.miniapp.ame/calc_prize_api.json"
        const prize = await axios.get(s3File).then((response) => {
            return response.data
        })
        const prizeObject = prize
            .filter((prize) => {
                if (parseInt(prize.produto) == prizeInfo.product_type_id) {
                    if (
                        parseInt(prizeInfo.price) >= parseInt(prize.faixa_minima) &&
                        parseInt(prizeInfo.price) <= parseInt(prize.faixa_maxima)
                    ) {
                        return prize
                    }
                }
            })
            .map((x) => {
                return [
                    {
                        id: 12,
                        premio_liquido: x.premio_liquido_12,
                        premio_bruto: x.premio_bruto_12,
                    },
                    {
                        id: 24,
                        premio_liquido: x.premio_liquido_24,
                        premio_bruto: x.premio_bruto_24,
                    },
                ]
            })
        if (typeof prizeObject[0] == "undefined") {
            return {
                message: "Valor excede o limite",
                status: false,
            }
        }
        return prizeObject[0]
    }

    async sendProposal(proposal: any) {
        log.debug("Sending proposal to Partner")
        let result
        try {
            const response = await this.requestService.makeRequest(
                this.requestService.ENDPOINTS.RENEW_PORTABLE_URL_SALE,
                this.requestService.METHODS.POST,
                proposal,
                Tenants.RENEW_PORTABLE_DIGIBEE
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
                status: SoldProposalStatus.renewed,
                receivedPaymentNotification: proposal,
            })
            log.debug("saveSoldProposal:success")
        } catch (e) {
            log.debug("saveSoldProposal:Fail")
            log.error(e)
        }
    }
}
