import { inject, injectable } from "inversify"
import { getLogger } from "../../../server/Logger"
import { TYPES } from "../../../inversify/inversify.types"
import { AuthTokenService } from "../../authToken/services/AuthTokenService"
import { RequestService } from "../../authToken/services/RequestService"
import { ParameterStore } from "../../../configs/ParameterStore"
import { ResidentialProposalRepository } from "../../residentialProposal/repository/ResidentialProposalRepository"
import { ResidentialSoldProposalRepository } from "../../residentialProposal/repository/ResidentialSoldProposalRepository"
import { SmartphoneSoldProposalRepository } from "../../smartphoneProposal/repository/SmartphoneSoldProposalRepository"
import { SmartphoneProposalRepository } from "../../smartphoneProposal/repository/SmartphoneProposalRepository"
import { SmartphoneProposalResponseRepository } from "../../smartphoneProposal/repository/SmartphoneProposalResponseRepository"
import { SoldProposalRepository } from "../repository/SoldProposalRepository"
import Plans from "../../residentialProposal/services/Plans"
import { PetSoldProposalRepository } from "../../petProposal/repository/PetSoldProposalRepository"
import moment from "moment"

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
        @inject("PetSoldProposalRepository")
        private petSoldProposalRepository: PetSoldProposalRepository,
        @inject("SoldProposalRepository")
        private soldProposalRepository: SoldProposalRepository,
        @inject(TYPES.ParameterStore)
        private parameterStore: ParameterStore
    ) {}

    async retrievePlans(customerId: string, raw?: boolean) {
        log.debug("retrievePlans")
        log.debug("Showing Raw Plans: " + !!raw)
        const residentialPlansFromDB = await this.residentialSoldProposalRepository.findAllFromCustomer(customerId)
        const smartphonePlansFromDB = await this.smartphoneSoldProposalRepository.findAllFromCustomer(customerId)
        const petPlansPlansFromDB = await this.petSoldProposalRepository.findAllFromCustomer(customerId)

        let smartphonePlans = []
        let residentialPlans = []
        let petPlans = []
        if (residentialPlansFromDB) {
            if (raw) {
                residentialPlans = Object.assign(residentialPlansFromDB)
            } else {
                residentialPlans = Object.assign(residentialPlansFromDB).map((x) => {
                    const proposal = x.receivedPaymentNotification?.attributes?.customPayload?.proposal
                    const address = x.receivedPaymentNotification?.attributes?.customPayload?.proposal
                    const selectedPlan = x.receivedPaymentNotification?.attributes?.customPayload?.proposal
                    return {
                        id: x.order,
                        description: x.receivedPaymentNotification?.title,
                        date: moment(proposal?.dataInicioVigencia).format("DD/MM/YYYY"),
                        value: x.receivedPaymentNotification?.amount,
                        protocol: x.receivedPaymentNotification?.nsu,
                        address: address?.imovel?.endereco,
                        coverage: Plans.find((x) => x.id == selectedPlan?.planoId),
                    }
                })
            }
        }
        if (smartphonePlansFromDB) {
            if (raw) {
                smartphonePlans = Object.assign(smartphonePlansFromDB)
            } else {
                smartphonePlans = Object.assign(smartphonePlansFromDB).map((x) => {
                    const proposal = x.receivedPaymentNotification?.attributes?.customPayload?.proposal
                    const selectedPlan = x.receivedPaymentNotification?.attributes?.customPayload?.selectedPlan
                    const device = proposal?.portable_equipment_risk_data

                    return {
                        id: x.order,
                        description: x.receivedPaymentNotification?.title,
                        date: moment(x.createdAt).format("DD/MM/YYYY"),
                        diffDays: moment().diff(moment(x.createdAt), "days"),
                        value: x.receivedPaymentNotification?.amount,
                        protocol: x.receivedPaymentNotification?.nsu,
                        device: device?.risk_description,
                        deviceValue: device?.equipment_value ? device?.equipment_value * 100 : 0,
                        imei: device?.device_serial_code,
                        coverage: selectedPlan?.coverage,
                        guarantee: selectedPlan?.guarantee,
                        stolenFranchise: selectedPlan.stolenFranchise,
                        brokenFranchise: selectedPlan.brokenFranchise,
                        screenFranchise: selectedPlan.screenFranchise,
                    }
                })
            }
        }
        if (petPlansPlansFromDB) {
            if (raw) {
                petPlans = Object.assign(petPlansPlansFromDB)
            } else {
                petPlans = Object.assign(petPlansPlansFromDB).map((x) => {
                    return {
                        status: x.success ? "Contratado" : "Não Contratado",
                        initial_date: moment(x.createdAt).format("DD/MM/YYYY"),
                        partner: "Amigoo Pet",
                    }
                })
            }
        }
        return { residentialPlans, smartphonePlans, petPlans }
    }

    /**
     * Este método é utilizado apenas para testes
     */
    async deleteOrderFromCustomer(customerId: string, orderId: string) {
        log.debug("deleteOrderFromCustomer")
        this.soldProposalRepository.deleteByCustomerAndOrder(customerId, orderId)
    }

    async retrieveConfigs() {
        const environment = process.env.DYNAMODB_ENV
        if (environment === "prod") {
            return { RESULT: "NOTHING TO SEE HERE" }
        }
        return {
            RESIDENTIAL: {
                DYNAMO_ENV: environment,
                CLIENT_ID: await this.parameterStore.getSecretValue("CLIENT_ID"),
                CLIENT_SECRET: await this.parameterStore.getSecretValue("CLIENT_SECRET"),
                CLIENT_SCOPE: await this.parameterStore.getSecretValue("CLIENT_SCOPE"),
                URL_AUTHORIZATION: await this.parameterStore.getSecretValue("URL_AUTHORIZATION"),
                URL_ZIPCODE: await this.parameterStore.getSecretValue("URL_ZIPCODE"),
                URL_PLANS: await this.parameterStore.getSecretValue("URL_PLANS"),
                URL_SALE: await this.parameterStore.getSecretValue("URL_SALE"),
                CONTRACT_NUMBER: await this.parameterStore.getSecretValue("CONTRACT_NUMBER"),
                BROKER_NUMBER: await this.parameterStore.getSecretValue("BROKER_NUMBER"),
                AME_COMISSION: await this.parameterStore.getSecretValue("AME_COMISSION"),
                BROKER_COMISSION: await this.parameterStore.getSecretValue("BROKER_COMISSION"),
            },
            SMARTPHONE: {
                SMARTPHONE_API_KEY: await this.parameterStore.getSecretValue("SMARTPHONE_API_KEY"),
                SMARTPHONE_URL_AUTHORIZATION: await this.parameterStore.getSecretValue("SMARTPHONE_URL_AUTHORIZATION"),
                SMARTPHONE_URL_SALE: await this.parameterStore.getSecretValue("SMARTPHONE_URL_SALE"),
            },
            CALINDRA_JWT_SECRET: await this.parameterStore.getSecretValue("CALINDRA_JWT_SECRET"),
            EMAIL: {
                MAIL_ACCESS_KEY_ID: await this.parameterStore.getSecretValue("MAIL_ACCESS_KEY_ID"),
                MAIL_SECRET_ACCESS_KEY: await this.parameterStore.getSecretValue("MAIL_SECRET_ACCESS_KEY"),
            },
        }
    }

    async checkTable() {
        const result = {}
        result[ResidentialProposalRepository.TABLE] = await this.residentialProposalRepository.checkTable()
        result[SmartphoneProposalRepository.TABLE] = await this.smartphoneProposalRepository.checkTable()
        result[SmartphoneProposalResponseRepository.TABLE] = await this.smartphoneProposalResponseRepository.checkTable()
        result[SmartphoneSoldProposalRepository.TABLE] = await this.smartphoneSoldProposalRepository.checkTable()
        return result
    }
}
