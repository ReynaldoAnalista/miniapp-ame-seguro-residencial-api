import { inject, injectable } from "inversify"
import { getLogger } from "../../../server/Logger"
import { AuthTokenService } from "../../authToken/services/AuthTokenService"
import { RequestService } from "../../authToken/services/RequestService"
import { Tenants } from "../../default/model/Tenants"
import Plans from "./Plans"
import { PetProposalUtil } from "./PetProposalUtil"
import { PetProposalRepository } from "../repository/PetProposalRepository"
import { PetSoldProposalRepository } from "../repository/PetSoldProposalRepository"

const log = getLogger("PetProposalService")

@injectable()
export class PetProposalService {
    constructor(
        @inject("AuthTokenService") private authTokenService: AuthTokenService,
        @inject("RequestService") private requestService: RequestService,
        @inject("PetProposalUtil") private petProposalUtil: PetProposalUtil,
        @inject("PetProposalRepository") private petProposalRepository: PetProposalRepository,
        @inject("PetSoldProposalRepository") private soldProposalRepository: PetSoldProposalRepository
    ) {}

    listPlans(): any[] {
        const result = Plans
        return result
    }

    async sendProposal(signedPayment: any) {
        const proposal = await this.authTokenService.unsignNotification(signedPayment)
        const planId = proposal.attributes?.customPayload.proposal.planId
        const proposalPets = await this.petProposalUtil.formatQuoteProposal(proposal.attributes?.customPayload)
        log.info("Formatação dos campos para cotação")
        const quotePlan = await this.quotePlans(planId, proposalPets)
        log.info("Solicita a cotação dos planos")
        const formatProposal = await this.petProposalUtil.formatRequestProposal(proposal)
        const quoteId = quotePlan.data.contract_uuid
        const getProposal = await this.requestProposal(quoteId, formatProposal)
        const databaseProposalFormat = await this.petProposalUtil.formatDatabaseProposal(quoteId, proposal, getProposal)
        await this.petProposalRepository.create(databaseProposalFormat)
        log.info("Salva a proposta no banco de dados")
        const soldProposalFormat = await this.petProposalUtil.formatDatabaseSoldProposal(
            databaseProposalFormat,
            proposal.attributes?.customPayload?.customerId
        )
        await this.soldProposalRepository.create(soldProposalFormat)
        log.info("Salva a proposta no banco de Sold Proposal de Pet")
        return getProposal
    }

    async descPlans(planId: string) {
        let result
        try {
            const response = await this.requestService.makeRequest(
                this.requestService.ENDPOINTS.PET_URL_BASE,
                this.requestService.METHODS.GET,
                null,
                Tenants.PET,
                `seguro-pet/v2/plan/${planId}`
            )
            result = response.data
            log.info(`Success Desc Plan :${planId}`)
        } catch (e) {
            const status = e.response?.status
            result = null
            log.debug(`Error %j`, e)
            log.debug("Error when trying to Desc Plan")
            log.debug(`Status Code: ${status}`)
        }
        log.debug("Debug Data " + result)
        return result
    }

    async quotePlans(planId: string, body: any) {
        let result
        try {
            const response = await this.requestService.makeRequest(
                this.requestService.ENDPOINTS.PET_URL_BASE,
                this.requestService.METHODS.POST,
                body,
                Tenants.PET,
                `seguro-pet/v2/quote/${planId}`
            )
            result = response.data
            log.info(`Success Quotation Plan :${planId}`)
        } catch (e) {
            const status = e.response?.status
            result = null
            log.debug(`Error %j`, e)
            log.debug("Error when trying to Quotation Plan")
            log.debug(`Status Code: ${status}`)
        }
        log.debug("Debug Data " + result)
        return result
    }

    async requestProposal(contractId, formatProposal) {
        let result
        try {
            const petEnrollURL = `seguro-pet/v2/enroll/${contractId}`
            const response = await this.requestService.makeRequest(
                this.requestService.ENDPOINTS.PET_URL_BASE,
                this.requestService.METHODS.POST,
                formatProposal,
                Tenants.PET,
                petEnrollURL
            )
            result = response.data
            log.info(`Success proposal :${contractId}`)
        } catch (e) {
            const status = e.response?.status
            result = null
            log.debug(`Error %j`, e.message)
            log.debug("Error when trying to proposal Plan")
            log.debug(`Status Code: ${status}`)
            log.debug("ERROR", e)
        }
        return result
    }
}
