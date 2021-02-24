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

    async retrieveConfigs() {
        return {
            RESIDENTIAL: {
                CLIENT_ID: (await this.parameterStore.getSecretValue("CLIENT_ID")),
                CLIENT_SECRET: (await this.parameterStore.getSecretValue("CLIENT_SECRET")),
                CLIENT_SCOPE: (await this.parameterStore.getSecretValue("CLIENT_SCOPE")),
                URL_AUTHORIZATION: (await this.parameterStore.getSecretValue("URL_AUTHORIZATION")),
                URL_ZIPCODE: (await this.parameterStore.getSecretValue("URL_ZIPCODE")),
                URL_PLANS: (await this.parameterStore.getSecretValue("URL_PLANS")),
                URL_SALE: (await this.parameterStore.getSecretValue("URL_SALE")),
                CONTRACT_NUMBER: (await this.parameterStore.getSecretValue("CONTRACT_NUMBER")),
                BROKER_NUMBER: (await this.parameterStore.getSecretValue("BROKER_NUMBER")),
                AME_COMISSION: (await this.parameterStore.getSecretValue("AME_COMISSION")),
                BROKER_COMISSION: (await this.parameterStore.getSecretValue("BROKER_COMISSION")),
            },
            SMARTPHONE: {
                SMARTPHONE_API_KEY: (await this.parameterStore.getSecretValue("SMARTPHONE_API_KEY")),
                SMARTPHONE_URL_AUTHORIZATION: (await this.parameterStore.getSecretValue("SMARTPHONE_URL_AUTHORIZATION")),
                SMARTPHONE_URL_SALE: (await this.parameterStore.getSecretValue("SMARTPHONE_URL_SALE")),
            },
            CALINDRA_JWT_SECRET: (await this.parameterStore.getSecretValue("CALINDRA_JWT_SECRET")),
        }
    }
}
