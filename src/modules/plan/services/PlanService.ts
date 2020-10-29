import { inject, injectable } from "inversify";
import { getLogger } from "../../../server/Logger";
import { TYPES } from "../../../inversify/inversify.types";
import { AuthTokenService } from "../../authToken/services/AuthTokenService";
import { AuthToken } from "../../authToken/model/AuthToken";
import { RequestService } from "../../authToken/services/RequestService";
import { Plan } from "../model/Plan";
import { Proposal } from "../model/Proposal";
import { PlanRepository } from "../repository/PlanRepository";

const log = getLogger("PlanService")

@injectable()
export class PlanService {

    constructor(
        @inject("AuthTokenService")
        private authTokenService: AuthTokenService,

        @inject("RequestService")
        private requestService: RequestService,

        @inject("PlanRepository")
        private planRepository: PlanRepository
    ) {
    }

    async retrievePlanList(
        property: string,
        zipCode: string,
    ) {
        log.debug("retrievePlanList");
        try {
            let result: object[] = await this.requestService.makeRequest(
                this.requestService.ENDPOINTS.URL_PLANS,
                this.requestService.METHODS.GET,
                null,
                `?contrato=6588&ocupacao=1&imovel=${property}&construcao=1&cep=${zipCode}&comissao=10`
            )
            if (result && result.length) {
                result = result.map(item => Plan.fromObject(item))
            }
            return result
        } catch (err) {
            log.error('Ocorreu um erro ao tentar buscar os preços.');
            return [];
        }
    }

    async sendProposal(proposal: Proposal): Promise<Proposal> {
        log.debug("sendProposal %j", proposal);
        try {
            return await this.planRepository.create(proposal)
            // let result = await this.requestService.makeRequest(
            //     this.requestService.ENDPOINTS.URL_PLANS,
            //     this.requestService.METHODS.POST,
            //     proposal
            // )
            // return result
        } catch (err) {
            log.error(`Ocorreu um erro ao cadastrar a proposta %j`, { data: err?.response?.data, message: err.message });
            throw err;
        }
    }
}
