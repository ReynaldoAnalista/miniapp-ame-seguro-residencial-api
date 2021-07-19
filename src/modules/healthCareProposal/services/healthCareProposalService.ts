import { inject, injectable } from "inversify"
import { getLogger } from "../../../server/Logger"
import { AuthTokenService } from "../../authToken/services/AuthTokenService"
import { RequestService } from "../../authToken/services/RequestService"
import { Tenants } from "../../default/model/Tenants"

const log = getLogger("healthCareProposalService")

@injectable()
export class healthCareProposalService {
    constructor(
        @inject("AuthTokenService")
        private authTokenService: AuthTokenService,
        @inject("RequestService")
        private requestService: RequestService
    ) {}

    async proposal(signedPayment: any) {
        const proposal = await this.authTokenService.unsignNotification(signedPayment)
        const processProposal = await this.processProposal(proposal)
        log.info("Enviano a proposta de HeathCare para o Parceiro")
    }

    async processProposal(proposal: any) {
        log.info("Sending HeatlCare proposal to Partner")
        let result
        try {
            const response = await this.requestService.makeRequest(
                this.requestService.ENDPOINTS.HEALTHCARE_URL_BASE,
                this.requestService.METHODS.POST,
                proposal,
                Tenants.LIFE,
                "/adesao"
            )
            if (response.data.status === "200") {
                result = { success: true, content: response.data }
                log.info("Success HeathCarea proposal sent")
            } else {
                result = { success: false, content: response.data }
                log.error("HeathCarea proposal Error")
            }
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
}
