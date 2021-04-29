import { inject, injectable } from "inversify";
import { getLogger } from "../../../server/Logger";
import { TYPES } from "../../../inversify/inversify.types";
import { AuthTokenService } from "../../authToken/services/AuthTokenService";
import { RequestService } from "../../authToken/services/RequestService";
import { ParameterStore } from "../../../configs/ParameterStore";
import { SmartphoneSoldProposal } from "../../smartphoneProposal/model/SmartphoneSoldProposal";
import { Tenants } from "../../default/model/Tenants";
import Plans from "./Plans";
import moment from "moment";
import { PetProposalUtil } from "./PetProposalUtil";
import { PetProposalRepository } from "../repository/PetProposalRepository";

const log = getLogger("PetProposalService");

@injectable()
export class PetProposalService {
    constructor(
        @inject("AuthTokenService") private authTokenService: AuthTokenService,
        @inject("RequestService") private requestService: RequestService,
        @inject("PetProposalUtil") private petProposalUtil: PetProposalUtil,
        @inject("PetProposalRepository") private petProposalRepository: PetProposalRepository,
    ) {}

    async listPlans() {
        let result;
        result = Plans;
        log.debug("Debug Data " + result);
        return result;
    }

    async sendProposal(signedPayment: any) {
        const proposal = await this.authTokenService.unsignNotification(signedPayment)
        const planId = proposal.attributes?.customPayload.proposal.planId;
        const proposalPets = await this.petProposalUtil.formatQuoteProposal(proposal.attributes?.customPayload)
        log.info("Formatação dos campos para cotação")
        const quotePlan = await this.quotePlans(planId, proposalPets)
        log.info("Solicita a cotação dos planos")
        const formatProposal = await this.petProposalUtil.formatRequestProposal(proposal)
        const quoteId = quotePlan.data.contract_uuid
        const getProposal = await this.requestProposal(quoteId, formatProposal)
        log.info("Faz a requisição da proposta")
        const databaseProposalFormat = await this.petProposalUtil.formatDatabaseProposal(quoteId, formatProposal, getProposal)
        await this.petProposalRepository.create(databaseProposalFormat)
        log.info("Salva a proposta no banco de dados")
        return getProposal
    }

    async deleteFromId(proposalId : string) {

    }

    async descPlans(planId: string) {
        let result;
        try {
            const response = await this.requestService.makeRequest(
                this.requestService.ENDPOINTS.PET_URL_BASE,
                this.requestService.METHODS.GET,
                null,
                Tenants.PET,
                `seguro-pet/v2/plan/${planId}`
            );
            result = response.data;
            log.info(`Success Desc Plan :${planId}`);
        } catch (e) {
            const status = e.response?.status;
            result = null;
            log.debug(`Error %j`, e);
            log.debug("Error when trying to Desc Plan");
            log.debug(`Status Code: ${status}`);
        }
        log.debug("Debug Data " + result);
        return result;
    }
    
    async quotePlans(planId: string, body: any) {
        let result;
        try {   
            const response = await this.requestService.makeRequest(
                this.requestService.ENDPOINTS.PET_URL_BASE,
                this.requestService.METHODS.POST,
                body,
                Tenants.PET,
                `seguro-pet/v2/quote/${planId}`
            );
            result = response.data;
            log.info(`Success Quotation Plan :${planId}`);
        } catch (e) {
            const status = e.response?.status;
            result = null;
            log.debug(`Error %j`, e);
            log.debug("Error when trying to Quotation Plan");
            log.debug(`Status Code: ${status}`);
        }
        log.debug("Debug Data " + result);
        return result;
    }

    async requestProposal(contractId, formatProposal) {
        let result        
        try {
            const response = await this.requestService.makeRequest(
                this.requestService.ENDPOINTS.PET_URL_BASE,
                this.requestService.METHODS.POST,
                formatProposal,
                Tenants.PET,
                `seguro-pet/v2/enroll/${contractId}`
            );
            result = response.data;
            log.info(`Success proposal :${contractId}`);
        } catch (e) {
            const status = e.response?.status;
            result = null;
            log.debug(`Error %j`, e.message);
            log.debug("Error when trying to proposal Plan");
            log.debug(`Status Code: ${status}`);
        }
        return result;
    }


}
