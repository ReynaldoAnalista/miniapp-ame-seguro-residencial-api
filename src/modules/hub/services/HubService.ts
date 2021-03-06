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
import { lifeProposalSoldRepository } from "../../lifeProposal/repository/lifeProposalSoldRepository"
const cache = require("memory-cache")
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
        @inject("lifeProposalSoldRepository")
        private lifeProposalSoldRepository: lifeProposalSoldRepository,
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
        const portablePlansPlansFromDB = await this.portableSoldProposalRepository.findAllFromCustomerParseTenant(customerId, Tenants.PORTABLE)
        const portablePlansPlansGEFromDB = await this.portableSoldProposalRepository.findAllFromCustomerParseTenant(customerId, Tenants.EXT_GE_AME)
        const renewPortablePlansPlansFromDB = await this.renewPortableSoldProposal.findAllFromCustomer(customerId)
        const lifePlansFromDB = await this.lifeProposalSoldRepository.findAllFromCustomer(customerId)

        let smartphonePlans = []
        let residentialPlans = []
        let petPlans = []
        let healthCarePlans = []
        let portablePlans = []
        let portableGePlans = []
        let renewPortablePlans = []
        let lifePlans = []
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
                        date: moment(
                            x.receivedPaymentNotification.attributes.customPayload.proposal.dataInicioVigencia,
                            "YYYY-MM-DD"
                        ).format("DD/MM/YYYY"),
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
                        name: x.tenant
                    }
                })
            }
        }
        if (portablePlansPlansGEFromDB) {
            if (raw) {
                portableGePlans = Object.assign(portablePlansPlansGEFromDB)
            } else {
                portableGePlans = Object.assign(portablePlansPlansGEFromDB).map((x) => {
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
                        name: x.tenant
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
                        partner: "Rede Mais Sa??de",
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
                        name: x.tenant
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
        if (lifePlansFromDB) {
            lifePlans = Object.assign(lifePlansFromDB).map((x) => {
                return {
                    id: x?.order,
                    date: moment(x.createdAt).format("DD/MM/YYYY"),
                    diffDays: moment().diff(moment(x.createdAt), "days"),
                    people_name: x.receivedPaymentNotification.attributes.customPayload.proposal.insured.name,
                    partner: "Metlife",
                    status: this.translateStatusPlan(x.status, moment(x.createdAt)),
                    coverage: x.receivedPaymentNotification.attributes.customPayload.proposal.coverage,
                    name: Tenants.LIFE,
                }
            })
        }
        return { residentialPlans, smartphonePlans, petPlans, healthCarePlans, portablePlans, portableGePlans, renewPortablePlans, lifePlans }
    }

    /**
     * Este m??todo ?? utilizado apenas para testes
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
        const TOKEN_CACHE = `TOKENCACHE_FAQ`
        if (cache.get(TOKEN_CACHE)) {
            return cache.get(TOKEN_CACHE)
        }
        const infoFaq = {
            agreement: await this.agreementPlanFaq(),
            pet: await this.faqInfoJson("assistencia-pet-ame"),
            residencial: await this.faqInfoJson("seguro-residencial"),
            smartphone: await this.faqInfoJson("seguro-celular"),
            dental: await this.faqInfoJson("seguro-dental-ame"),
            healthcare: await this.faqInfoJson("assistencia-saude-ame"),
            devices: await this.faqInfoJson("seguro-portateis"),
            life: await this.faqInfoJson("seguro-de-vida"),
        }
        cache.put(TOKEN_CACHE, infoFaq, 1000 * 60 * 60 * 20)
        return infoFaq
    }

    translateStatusPlan(status, createdDate) {
        if (createdDate.diff(moment(), "years") < 0) {
            return "Inativo"
        }
        switch (status) {
            case "PROCESSED":
                return "Ativo"
            case "CANCELED":
                return "Cancelado"
            case "PROSSESSING":
                return "Ativo"
            default:
                return ""
        }
    }

    async agreementPlanFaq() {
        return [
            {
                title: "Como funcionam os Seguros e Assist??ncias da Ame?",
                content:
                    // eslint-disable-next-line prettier/prettier
                    "Unimos a praticidade da Ame com a experi??ncia de algumas das maiores seguradoras do Brasil pra voc?? relaxar e deixar que a gente cuide dos imprevistos. Voc?? faz a contrata????o e o pagamento dos Seguros e Assist??ncias aqui na Ame e, quando precisar usar, ?? s?? falar com a seguradora.",
            },
            {
                title: "Por que contratar os Seguros e Assist??ncias na Ame?",
                content:
                    // eslint-disable-next-line prettier/prettier
                    "A gente facilita todo o processo, cuida das burocracias pra voc?? e ainda te d?? cashback na contrata????o de qualquer um dos seguros e assist??ncias. Legal, n??? E olha s??, o dinheiro de volta fica dispon??vel na sua conta Ame em 30 dias ap??s a confirma????o do pagamento ;)",
            },
            {
                title: "Posso contratar um seguro pra outra pessoa?",
                content:
                    // eslint-disable-next-line prettier/prettier
                    "Voc?? pode contratar um seguro ou assist??ncia apenas para o titular da conta Ame. Caso queira contratar em nome de outra pessoa, ?? s?? baixar o app da Ame no celular de quem voc?? quer fazer a contrata????o, criar uma conta Ame em nome dessa pessoa e pronto, contrate o seguro e assist??ncia que a pessoa precisa! ",
            },
            {
                title: "Contratei um dos seguros, mas ainda n??o recebi a confirma????o. E agora?",
                content:
                    // eslint-disable-next-line prettier/prettier
                    "Ah, depois de concluir o pagamento do seu seguro ou assist??ncia aqui na Ame, a confirma????o ?? enviada por e-mail com todas as informa????es em at?? 5 dias. Fique de olho na caixa de spam, beleza? Caso tenha passado desses prazos, entre em contato com a gente atrav??s dos n??meros 4004-2120 (todas as regi??es) ou 0800 229 7667 (somente RJ).",
            },
            {
                title: "Quando recebo meu cashback?",
                content:
                    // eslint-disable-next-line prettier/prettier
                    "Em at?? 30 dias ap??s a aprova????o do pagamento o cashback fica dispon??vel pra voc?? usar como quiser, ?? s?? acompanhar tudo no seu extrato.",
            },
            {
                title: "Como eu aciono o seguro que contratei?",
                content:
                    "Ah, ?? simples. Para acionar o seguro, em caso de sinistro (qualquer evento em que o bem segurado sofre um acidente ou preju??zo material), entre em contato com a seguradora e informe todos os dados sobre o servi??o que voc?? quer usar. J?? para as assist??ncias Pet e Dental, ?? s?? consultar as redes credenciadas e marcar suas consultas, exames e procedimentos normalmente.",
            },
            {
                title: "Como consulto a rede credenciada das assist??ncias Pet ?",
                content: "Para Assist??ncia Pet, consulte em encontre cl??nicas parceiras e cl??nicas indicadas | Amigoo Pet",
            },
            {
                title: "Como consulto a rede credenciada das assist??ncias Dental?",
                content: "Para Assist??ncia Dental, consulte em encontre dentistas e cl??nicas do plano dental | W.Dental.",
            },
        ]
    }

    async securyInfoFormatter(faqUnformated) {
        return faqUnformated.map((faq) => {
            return {
                title: faq.pergunta,
                content: faq.resposta
                    .replace(/<\/?[^>]+(>|$)/g, "")
                    .replace(/\&nbsp;/g, "")
                    .replace(/(\r\n|\n|\r)/gm, ""),
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
            log.error("Erro ao buscar os FAQ", error.message)
        }
        return result
    }
}
