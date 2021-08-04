import { inject, injectable } from "inversify"
import { getLogger } from "../../../server/Logger"
import { AuthTokenService } from "../../authToken/services/AuthTokenService"
import { RequestService } from "../../authToken/services/RequestService"
import { Tenants } from "../../default/model/Tenants"
import { LifeProposalUtil } from "./LifeProposalUtil"

const log = getLogger("LifeProposalService")

@injectable()
export class LifeProposalService {
    constructor(
        @inject("AuthTokenService") private authTokenService: AuthTokenService,
        @inject("RequestService") private requestService: RequestService,
        @inject("LifeProposalUtil") private lifeProposalUtil: LifeProposalUtil
    ) {}

    async cotation(cotationPropose: any) {
        const formatPropose = await this.lifeProposalUtil.formatCotation(cotationPropose)
        const sendCotation = await this.getCotation(formatPropose)
        return sendCotation
    }

    async getCotation(cotation: any) {
        log.debug("Sending proposal to Partner")
        let result
        try {
            const response = await this.requestService.makeRequest(
                this.requestService.ENDPOINTS.LIFE_URL_BASE,
                this.requestService.METHODS.POST,
                cotation,
                Tenants.LIFE,
                "/rest-seguro-vida/cotacoes?company_code=0514"
            )
            result = { success: true, content: response.data }
            log.info("Success proposal sent")
        } catch (e) {
            const status = e.response?.status
            const statusText = e
            result = { success: false, status: status, message: statusText }
            log.error(`Error %j`, statusText)
            log.debug("Error when trying to send proposal")
            log.debug(`Status Code: ${status}`)
        }
        return result
    }

    async proposal(signedPayment: any) {
        const formatProposal = await this.lifeProposalUtil.formatProposal(signedPayment)
        log.info("Format Life Proposal")
        const sendProposal = await this.sendProposal(formatProposal)
        return sendProposal
    }

    async sendProposal(proposal: any) {
        let result
        try {
            const response = await this.requestService.makeRequest(
                this.requestService.ENDPOINTS.LIFE_URL_BASE,
                this.requestService.METHODS.POST,
                proposal,
                Tenants.LIFE,
                "/rest-seguro-vida/proposta?company_code=0514"
            )
            result = { success: true, content: response.data }
            log.info("Success proposal sent")
        } catch (e) {
            result = e
            log.debug("Error when trying to send proposal")
        }
        return result
    }
}
