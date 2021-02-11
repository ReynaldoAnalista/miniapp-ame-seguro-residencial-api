import {inject, injectable} from "inversify";
import {getLogger} from "../../../server/Logger";
import {TYPES} from "../../../inversify/inversify.types";
import {AuthTokenService} from "../../authToken/services/AuthTokenService";
import {RequestService} from "../../authToken/services/RequestService";
import {ParameterStore} from "../../../configs/ParameterStore";
import {ResidentialProposalRepository} from "../../residentialProposal/repository/ResidentialProposalRepository";
import {ResidentialSoldProposalRepository} from "../../residentialProposal/repository/ResidentialSoldProposalRepository";
import {SmartphoneSoldProposalRepository} from "../../smartphoneProposal/repository/SmartphoneSoldProposalRepository";

const log = getLogger("ResidentialProposalService")

@injectable()
export class HubService {

    constructor(
        @inject("AuthTokenService")
        private authTokenService: AuthTokenService,
        @inject("RequestService")
        private requestService: RequestService,
        @inject("ResidentialSoldProposalRepository")
        private residentialSoldProposalRepository: ResidentialSoldProposalRepository,
        @inject("SmartphoneSoldProposalRepository")
        private smartphoneSoldProposalRepository: SmartphoneSoldProposalRepository,
        @inject(TYPES.ParameterStore)
        private parameterStore: ParameterStore
    ) {
    }

    async retrievePlans(customerId: string) {
        log.debug("retrievePlans")
        const residentialPlans = await this.residentialSoldProposalRepository.findAllFromCustomer(customerId)
        const smartphonePlans = await this.smartphoneSoldProposalRepository.findAllFromCustomer(customerId)
        return {residentialPlans, smartphonePlans}
    }

    /**
     * Este método é utilizado apenas para testes
     */
    async deleteOrderFromCustomer(customerId: string, order: string) {
        log.debug("deleteOrderFromCustomer")
        await this.residentialSoldProposalRepository.deleteByCustomerAndOrder(customerId, order)
        await this.smartphoneSoldProposalRepository.deleteByCustomerAndOrder(customerId, order)
    }
}
