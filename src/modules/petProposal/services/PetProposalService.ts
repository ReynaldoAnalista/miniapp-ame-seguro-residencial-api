import { inject, injectable } from "inversify";
import { getLogger } from "../../../server/Logger";
import { TYPES } from "../../../inversify/inversify.types";
import { AuthTokenService } from "../../authToken/services/AuthTokenService";
import { RequestService } from "../../authToken/services/RequestService";
import { ParameterStore } from "../../../configs/ParameterStore";
import { SmartphoneSoldProposal } from "../../smartphoneProposal/model/SmartphoneSoldProposal";
import { Tenants } from "../../default/model/Tenants";
import Plans from "./Plans";
import { PetQuotationPlan } from "../model/PetQuotationPlan";

const log = getLogger("PetProposalService");

@injectable()
export class PetProposalService {
    constructor(
        @inject("RequestService") private requestService: RequestService
    ) {}

    async listPlans() {
        let result;
        result = Plans;
        log.debug("Debug Data " + result);
        return result;
    }

    async sendProposal(proposal: any) {
        const quote = await 
        log.info("Solicita a cotação")
    }

    async descPlans(planId: string) {
        let result;
        try {
            const response = await this.requestService.makeRequest(
                this.requestService.ENDPOINTS.PET_URL_BASE,
                this.requestService.METHODS.GET,
                null,
                "PET",
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

    async quotePlans(planId: string, body: PetQuotationPlan) {       
        let result;
        try {
            const response = await this.requestService.makeRequest(
                this.requestService.ENDPOINTS.PET_URL_BASE,
                this.requestService.METHODS.POST,
                body,
                "PET",
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
}
