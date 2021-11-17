/* eslint-disable prettier/prettier */
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
import { PortableSoldProposalRepository } from "../../portableProposal/repository/PortableSoldProposalRepository"
import { RenewPortableSoldProposal } from "../../renewPortableProposal/repository/RenewPortableSoldProposal"
import { SoldProposalRepository } from "../repository/SoldProposalRepository"
import Plans from "../../residentialProposal/services/Plans"
import { PetSoldProposalRepository } from "../../petProposal/repository/PetSoldProposalRepository"
import moment from "moment"
import { healthCareProposalSoldRepository } from "../../healthCareProposal/repository/healthCareProposalSoldRepository"
import { Tenants } from "../../default/model/Tenants"
import path from "path"
import util from "util"
import fs from "fs"
const readFile = util.promisify(fs.readFile)

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
        @inject("healthCareProposalSoldRepository")
        private healthCareProposalSoldRepository: healthCareProposalSoldRepository,
        @inject("SoldProposalRepository")
        private soldProposalRepository: SoldProposalRepository,
        @inject("PortableSoldProposalRepository")
        private portableSoldProposalRepository: PortableSoldProposalRepository,
        @inject("RenewPortableSoldProposal")
        private renewPortableSoldProposal: RenewPortableSoldProposal,
        @inject(TYPES.ParameterStore)
        private parameterStore: ParameterStore
    ) {}

    async retrievePlans(customerId: string, raw?: boolean) {
        log.debug("retrievePlans")
        log.debug("Showing Raw Plans: " + !!raw)
        const residentialPlansFromDB = await this.residentialSoldProposalRepository.findAllFromCustomer(customerId)
        const smartphonePlansFromDB = await this.smartphoneSoldProposalRepository.findAllFromCustomer(customerId)
        const petPlansPlansFromDB = await this.petSoldProposalRepository.findAllFromCustomer(customerId)
        const healthCarePlansPlansFromDB = await this.healthCareProposalSoldRepository.findByCustomerId(customerId)
        const portablePlansPlansFromDB = await this.portableSoldProposalRepository.findAllFromCustomer(customerId)
        const renewPortablePlansPlansFromDB = await this.renewPortableSoldProposal.findAllFromCustomer(customerId)

        let smartphonePlans = []
        let residentialPlans = []
        let petPlans = []
        let healthCarePlans = []
        let portablePlans = []
        let renewPortablePlans = []
        if (residentialPlansFromDB) {
            if (raw) {
                residentialPlans = Object.assign(residentialPlansFromDB)
            } else {
                residentialPlans = Object.assign(residentialPlansFromDB).map((x) => {
                    const proposal = x.receivedPaymentNotification?.attributes?.customPayload?.proposal
                    const address = x.receivedPaymentNotification?.attributes?.customPayload?.proposal
                    const selectedPlan = x.receivedPaymentNotification?.attributes?.customPayload?.proposal
                    let dataInicioVigencia = null
                    if (proposal) {
                        try {
                            if (proposal.dataInicioVigencia) {
                                dataInicioVigencia = proposal.dataInicioVigencia
                            } else {
                                dataInicioVigencia = proposal.proposal?.dataInicioVigencia
                            }
                        } catch (e) {
                            log.error("Erro ao informar dataInicioVigencia")
                            log.error(e)
                        }
                    }
                    return {
                        id: x.order,
                        description: x.receivedPaymentNotification?.title,
                        date: moment(x.createdAt).format("DD/MM/YYYY"),
                        value: x.receivedPaymentNotification?.amount,
                        protocol: x.receivedPaymentNotification?.nsu,
                        address: address?.imovel?.endereco,
                        status: this.translateStatusPlan(x.status, moment(x.createdAt)),
                        coverage: Plans.find((x) => x.id == selectedPlan?.planoId),
                        name: Tenants.RESIDENTIAL,
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
                        status: this.translateStatusPlan(x.status, moment(x.createdAt)),
                        stolenFranchise: selectedPlan?.stolenFranchise,
                        brokenFranchise: selectedPlan?.brokenFranchise,
                        screenFranchise: selectedPlan?.screenFranchise,
                        name: Tenants.SMARTPHONE,
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
                        date: moment(x.createdAt).format("DD/MM/YYYY"),
                        status: this.translateStatusPlan(x.status, moment(x.createdAt)),
                        partner: "Amigoo Pet",
                        name: Tenants.PET,
                    }
                })
            }
        }
        if (healthCarePlansPlansFromDB) {
            if (raw) {
                healthCarePlans = Object.assign(healthCarePlansPlansFromDB)
            } else {
                healthCarePlans = Object.assign(healthCarePlansPlansFromDB).map((x) => {
                    return {
                        id: x?.order,                        
                        date: moment(x.createdAt).format("DD/MM/YYYY"),
                        diffDays: moment().diff(moment(x.createdAt), "days"),
                        partner: "Rede Mais Saúde",
                        name: Tenants.HEALTHCARE,
                        status: this.translateStatusPlan(x.status, moment(x.createdAt)),
                        description: x.receivedPaymentNotification.attributes.description,
                        planType: x.receivedPaymentNotification.attributes.customPayload.proposal.planType,
                        paymentValue:
                            x.receivedPaymentNotification.attributes.customPayload.proposal.planType == 3
                                ? "R$ 286,80"
                                : "R$ 358,80",
                    }
                })
            }
        }
        if (portablePlansPlansFromDB) {
            if (raw) {
                portablePlans = Object.assign(portablePlansPlansFromDB)
            } else {
                portablePlans = Object.assign(portablePlansPlansFromDB).map((x) => {
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
                        status: this.translateStatusPlan(x.status, moment(x.createdAt)),
                        stolenFranchise: selectedPlan?.stolenFranchise,
                        brokenFranchise: selectedPlan?.brokenFranchise,
                        screenFranchise: selectedPlan?.screenFranchise,
                        name: Tenants.PORTABLE,
                    }
                })
            }
        }
        if (renewPortablePlansPlansFromDB) {
            if (raw) {
                renewPortablePlans = Object.assign(renewPortablePlansPlansFromDB)
            } else {
                renewPortablePlans = Object.assign(renewPortablePlansPlansFromDB).map((x) => {
                    const proposal = x.receivedPaymentNotification?.attributes?.customPayload?.proposal
                    const selectedPlan = x.receivedPaymentNotification?.attributes?.customPayload?.selectedPlan
                    const device = proposal?.portable_equipment_risk_data

                    return {
                        id: x?.order,                        
                        date: moment(x.createdAt).format("DD/MM/YYYY"),
                        diffDays: moment().diff(moment(x.createdAt), "days"),
                        partner: "Renova Laza",
                        status: this.translateStatusPlan(x.status, moment(x.createdAt)),
                        name: Tenants.RENEW_PORTABLE,
                    }
                })
            }
        }
        return { residentialPlans, smartphonePlans, petPlans, healthCarePlans, portablePlans, renewPortablePlans }
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

    async faqInfo() {
        return {
            agreement: await this.agreementPlanFaq(),
            pet: await this.faqInfoJson("assistencia-pet-ame"),
            residencial: await this.faqInfoJson("seguro-residencial"),
            smartphone: await this.faqInfoJson("seguro-celular"),
            dental: await this.faqInfoJson("seguro-dental-ame"),
            healthcare: await this.faqInfoJson("assistencia-saude-ame"),
            devices: await this.faqInfoJson("seguro-portateis"),
        }
    }

    translateStatusPlan(status, createdDate) {
        if(createdDate.diff(moment(), "years") < 0) {
            return "Inativo"
        }
        switch(status) {
            case "PROCESSED":
                return "Contratado"
            case "CANCELED":
                return "Cancelado" 
            case "PROCESSING":
                return "Contratado"
            default:
                return ""                            
        }
    }

    async agreementPlanFaq() {
        return [
            {
                title: "Como funcionam os Seguros e Assistências da Ame?",
                content:
                    // eslint-disable-next-line prettier/prettier
                    "Unimos a praticidade da Ame com a experiência de algumas das maiores seguradoras do Brasil pra você relaxar e deixar que a gente cuide dos imprevistos. Você faz a contratação e o pagamento dos Seguros e Assistências aqui na Ame e, quando precisar usar, é só falar com a seguradora."
            },
            {
                title: "Por que contratar os Seguros e Assistências na Ame?",
                content:
                    // eslint-disable-next-line prettier/prettier
                    "A gente facilita todo o processo, cuida das burocracias pra você e ainda te dá cashback na contratação de qualquer um dos seguros e assistências. Legal, né? E olha só, o dinheiro de volta fica disponível na sua conta Ame em 30 dias após a confirmação do pagamento ;)"
            },
            {
                title: "Posso contratar um seguro pra outra pessoa?",
                content:
                    // eslint-disable-next-line prettier/prettier
                    "Você pode contratar um seguro ou assistência apenas para o titular da conta Ame. Caso queira contratar em nome de outra pessoa, é só baixar o app da Ame no celular de quem você quer fazer a contratação, criar uma conta Ame em nome dessa pessoa e pronto, contrate o seguro e assistência que a pessoa precisa! "
            },
            {
                title: "Contratei um dos seguros, mas ainda não recebi a confirmação. E agora?",
                content:
                    // eslint-disable-next-line prettier/prettier
                    "Ah, depois de concluir o pagamento do seu seguro ou assistência aqui na Ame, a confirmação é enviada por e-mail com todas as informações em até 5 dias. Fique de olho na caixa de spam, beleza? Caso tenha passado desses prazos, entre em contato com a gente através dos números 4004-2120 (todas as regiões) ou 0800 229 7667 (somente RJ)."
            },
            {
                title: "Quando recebo meu cashback?",
                content:
                    // eslint-disable-next-line prettier/prettier
                    "Em até 30 dias após a aprovação do pagamento o cashback fica disponível pra você usar como quiser, é só acompanhar tudo no seu extrato."
            },
            {
                title: "Como eu aciono o seguro que contratei?",
                content:
                    "Ah, é simples. Para acionar o seguro, em caso de sinistro (qualquer evento em que o bem segurado sofre um acidente ou prejuízo material), entre em contato com a seguradora e informe todos os dados sobre o serviço que você quer usar. Já para as assistências Pet e Dental, é só consultar as redes credenciadas e marcar suas consultas, exames e procedimentos normalmente."
            },
            {
                title: "Como consulto a rede credenciada das assistências Pet ?",
                content: "Para Assistência Pet, consulte em encontre clínicas parceiras e clínicas indicadas | Amigoo Pet"
            },
            {
                title: "Como consulto a rede credenciada das assistências Dental?",
                content: "Para Assistência Dental, consulte em encontre dentistas e clínicas do plano dental | W.Dental."
            },
        ]
    }

    async securyInfoFormatter(faqUnformated) {        

        return faqUnformated.map(faq => {           
            return {
                "title" : faq.pergunta,
                "content" : faq.resposta.replace(/<\/?[^>]+(>|$)/g, "").replace(/\&nbsp;/g, '').replace(/(\r\n|\n|\r)/gm, "")
            }
        })
    }

    async faqInfoJson(securyInfo) {
        let result
        try {
            const response = await this.requestService.makeRequest(
                this.requestService.ENDPOINTS.FAQ,
                this.requestService.METHODS.GET,
                null,
                Tenants.FAQ,
                `/${securyInfo}`
            )
            result = await this.securyInfoFormatter(response.data.perguntas)
        } catch (error) {
            log.error("Erro ao buscar os FAQ", error)
        }
        return result
    }
}
