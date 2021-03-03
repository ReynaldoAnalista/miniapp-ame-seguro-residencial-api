import {inject, injectable} from "inversify";
import {getLogger} from "../../../server/Logger";
import {TYPES} from "../../../inversify/inversify.types";
import {AuthTokenService} from "../../authToken/services/AuthTokenService";
import {RequestService} from "../../authToken/services/RequestService";
import {ParameterStore} from "../../../configs/ParameterStore";
import {ResidentialProposalRepository} from "../../residentialProposal/repository/ResidentialProposalRepository";
import {ResidentialSoldProposalRepository} from "../../residentialProposal/repository/ResidentialSoldProposalRepository";
import {SmartphoneSoldProposalRepository} from "../../smartphoneProposal/repository/SmartphoneSoldProposalRepository";
import {SmartphoneProposalRepository} from "../../smartphoneProposal/repository/SmartphoneProposalRepository";
import {SmartphoneProposalResponseRepository} from "../../smartphoneProposal/repository/SmartphoneProposalResponseRepository";

const log = getLogger("ResidentialProposalService")

@injectable()
export class HubService {

    constructor(
        @inject("AuthTokenService")
        private authTokenService: AuthTokenService,
        @inject("RequestService")
        private requestService: RequestService,
        @inject("ResidentialProposalRepository")
        private residentialProposalRepository: ResidentialProposalRepository,
        @inject("ResidentialSoldProposalRepository")
        private residentialSoldProposalRepository: ResidentialSoldProposalRepository,
        @inject("SmartphoneProposalRepository")
        private smartphoneProposalRepository: SmartphoneProposalRepository,
        @inject("SmartphoneProposalResponseRepository")
        private smartphoneProposalResponseRepository: SmartphoneProposalResponseRepository,
        @inject("SmartphoneSoldProposalRepository")
        private smartphoneSoldProposalRepository: SmartphoneSoldProposalRepository,
        @inject(TYPES.ParameterStore)
        private parameterStore: ParameterStore
    ) {
    }

    async retrievePlans(customerId: string) {
        log.debug("retrievePlans")
        const residentialPlans = await this.residentialSoldProposalRepository.findAllFromCustomer(customerId)
        const smartphonePlansFromDB = await this.smartphoneSoldProposalRepository.findAllFromCustomer(customerId)

        const plans = [
            {
                id: 1,
                description: "Ame Proteção Total",
                percent: 17.84,
                stolenFranchise: 0.2,
                brokenFranchise: 0.15,
                screenFranchise: 0.1,
                coverage: "Roubo ou furto qualificado, quebra acidental e proteção de tela",
                guarantee: "Reparo ou em razão de impossibilidade, subtituição do bem"
            },
            {
                id: 2,
                description: "Ame Proteção Essencial",
                percent: 13.88,
                stolenFranchise: null,
                brokenFranchise: 0.15,
                screenFranchise: 0.1,
                coverage: "Quebra acidental e proteção de tela",
                guarantee: "Reparo ou em razão de impossibilidade, subtituição do bem"
            },
            {
                id: 3,
                description: "Ame Proteção de Tela",
                percent: 9.25,
                stolenFranchise: null,
                brokenFranchise: null,
                screenFranchise: 0.1,
                coverage: "Proteção de tela",
                guarantee: "Substituição da tela"
            }
        ]

        let smartphonePlans = []
        if (smartphonePlansFromDB) {
            smartphonePlans = Object.assign(smartphonePlansFromDB).map(x => {

                const proposal = x.receivedPaymentNotification?.attributes?.customPayload?.proposal
                const device = proposal.portable_equipment_risk_data

                return {
                    id: x.order,
                    descricao: x.receivedPaymentNotification.title,
                    data: '12/05/20',
                    valor: '1.200,00',
                    protocolo: '1243536363',
                    aparelho: device.risk_description,
                    imei: device.device_serial_code,
                    cobertura: `${x.receivedPaymentNotification.title} ${x.receivedPaymentNotification.descritpion}`,
                    garantia: '',
                    franquia: '200.00',
                }
            })
        }


        return { residentialPlans, smartphonePlans }
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
        const environment = process.env.DYNAMODB_ENV
        if (environment === 'prod') {
            return {RESULT: 'NOTHING TO SEE HERE'}
        }
        return {
            RESIDENTIAL: {
                DYNAMO_ENV: environment,
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
            EMAIL: {
                MAIL_ACCESS_KEY_ID: (await this.parameterStore.getSecretValue("MAIL_ACCESS_KEY_ID")),
                MAIL_SECRET_ACCESS_KEY: (await this.parameterStore.getSecretValue("MAIL_SECRET_ACCESS_KEY"))
            }
        }
    }

    async checkTable() {
        const environment = process.env.DYNAMODB_ENV
        let result = {}
        result[ResidentialProposalRepository.TABLE] = await this.residentialProposalRepository.checkTable()
        result[SmartphoneProposalRepository.TABLE] = await this.smartphoneProposalRepository.checkTable()
        result[SmartphoneProposalResponseRepository.TABLE] = await this.smartphoneProposalResponseRepository.checkTable()
        result[SmartphoneSoldProposalRepository.TABLE] = await this.smartphoneSoldProposalRepository.checkTable()
        return result
    }
}
