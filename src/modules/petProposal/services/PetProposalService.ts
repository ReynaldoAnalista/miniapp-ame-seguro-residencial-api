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
        const planId = proposal.customPayload.proposal.planId;
        const proposalPets = await this.formatPetProposal(proposal.customPayload.proposal)
        log.info("Formatação dos campos para cotação")
        const quotePlan = await this.quotePlans(planId, proposalPets)
        var contractId = quotePlan.data.contract_uuid
        log.info("Solicita a cotação dos planos")
        // const getProposal = await this.requestProposal(contractId)
        // log.info("Faz a requisição da proposta")
        // return getProposal
        return quotePlan
    }

    async formatPetProposal(proposal: any) {
        var productId : number = 0;
        try {
            var petsBirthDate = proposal.pets.map((prop) => {
                return {
                    age: Number(prop.age),
                    name: prop.namePet,
                    size: prop.size,
                    breed: prop.breed,
                    color: prop.color,
                    gender: prop.gender,
                    species: prop.species,
                    vaccined: prop.vaccined,
                    preexisting_condition: prop.preexisting_condition,
                    birth_date: moment(prop.birthDatePet, "DDMMYYYY").format("YYYY-MM-DD"),                    
                };
            });
            switch (proposal.planId) {
                case 48:
                    var productId = 33;
                    break;
                case 49:
                    var productId = 34;
                    break;
                case 50:
                    var productId = 35;
                    break;
            }
            return {
                pets: petsBirthDate,
                product_ids: [productId],
            };
        } catch (e) {
            log.debug("Format Proposal error: " + e.message);
        }
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

    async requestProposal(contractId) {
        let result
        try {
            const response = await this.requestService.makeRequest(
                this.requestService.ENDPOINTS.PET_URL_BASE,
                this.requestService.METHODS.POST,
                null,
                Tenants.PET,
                `seguro-pet/v2/enroll/${contractId}`
            );
            result = response.data;
            log.info(`Success proposal :${contractId}`);
        } catch (e) {
            const status = e.response?.status;
            result = null;
            log.debug(`Error %j`, e);
            log.debug("Error when trying to proposal Plan");
            log.debug(`Status Code: ${status}`);
        }
    }

}
