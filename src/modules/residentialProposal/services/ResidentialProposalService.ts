import { inject, injectable } from "inversify"
import { getLogger } from "../../../server/Logger"
import { TYPES } from "../../../inversify/inversify.types"
import { AuthTokenService } from "../../authToken/services/AuthTokenService"
import { RequestService } from "../../authToken/services/RequestService"
import { ResidentialProposalRepository } from "../repository/ResidentialProposalRepository"
import { ParameterStore } from "../../../configs/ParameterStore"
import Plans from "./Plans"
import { SmartphoneSoldProposal } from "../../smartphoneProposal/model/SmartphoneSoldProposal"
import { ResidentialSoldProposalRepository } from "../repository/ResidentialSoldProposalRepository"
import { Tenants } from "../../default/model/Tenants"
import { ResidentialSoldProposal } from "../model/ResidentialSoldProposal"

const log = getLogger("ResidentialProposalService")

@injectable()
export class ResidentialProposalService {
    constructor(
        @inject("AuthTokenService")
        private authTokenService: AuthTokenService,
        @inject("RequestService")
        private requestService: RequestService,
        @inject("ResidentialSoldProposalRepository")
        private residentialSoldProposalRepository: ResidentialSoldProposalRepository,
        @inject("ResidentialProposalRepository")
        private residentialProposalRepository: ResidentialProposalRepository,
        @inject(TYPES.ParameterStore)
        private parameterStore: ParameterStore
    ) {}

    async consultZipcode(zipcode: string) {
        log.debug("consultZipcode")
        let attempts = 2
        do {
            try {
                const result: any[] = (
                    await this.requestService.makeRequest(
                        this.requestService.ENDPOINTS.RESIDENTIAL_URL_ZIPCODE,
                        this.requestService.METHODS.GET,
                        null,
                        Tenants.RESIDENTIAL,
                        `/${zipcode}`
                    )
                )["data"]
                attempts = 0
                return result
            } catch (err) {
                const status = err.response?.status
                if (status === 401) {
                    log.debug("Not authorized, next attempt.")
                    await this.authTokenService.retrieveAuthorization(Tenants.RESIDENTIAL, true)
                    if (attempts === 1) {
                        log.debug("Authentication Token error")
                        throw { error: "Authentication Error", status: status, trace: "All authorization attempts fail" }
                    }
                    attempts = attempts - 1
                } else {
                    log.debug(`Error when retrive zipcode: ${zipcode}`)
                    log.debug(`Status Code: ${status}`)
                    log.debug(`x-b3-traceid: ${err.response?.headers["x-b3-traceid"]}`)
                    attempts = 0
                    throw {
                        error: "Error when retrive zipcode",
                        status: status,
                        trace: err.response?.headers["x-b3-traceid"],
                    }
                }
            }
        } while (attempts > 0)
    }

    async retrievePlanList(property: string, zipCode: string) {
        log.debug("retrievePlanList")
        const contractNumber = await this.parameterStore.getSecretValue("CONTRACT_NUMBER")
        const ameComission = await this.parameterStore.getSecretValue("AME_COMISSION")
        const brokerComission = await this.parameterStore.getSecretValue("BROKER_COMISSION")
        zipCode = zipCode.replace(/\D/g, "")
        const qs = `?contrato=${contractNumber}&ocupacao=1&imovel=${property}&construcao=1&cep=${zipCode}&comissao=${ameComission}&comissaoCorretor=${brokerComission}`
        let attempts = 2
        do {
            try {
                const result: any[] = (
                    await this.requestService.makeRequest(
                        this.requestService.ENDPOINTS.RESIDENTIAL_URL_PLANS,
                        this.requestService.METHODS.GET,
                        null,
                        Tenants.RESIDENTIAL,
                        qs
                    )
                )["data"]
                attempts = 0
                return result
            } catch (err) {
                const status = err.response?.status
                if (status === 401) {
                    log.debug("Not authorized, next attempt.")
                    await this.authTokenService.retrieveAuthorization(Tenants.RESIDENTIAL, true)
                    if (attempts === 1) {
                        log.debug("Authentication Token error")
                        throw { error: "Authentication Error", status: status, trace: "All authorization attempts fail" }
                    }
                    attempts = attempts - 1
                } else {
                    log.debug("Error on retrive plans")
                    log.debug(`Status Code: ${err.response?.status}`)
                    log.debug(`x-b3-traceid: ${err.response?.headers["x-b3-traceid"]}`)
                    attempts = 0
                    throw {
                        error: "Error on retrive plans",
                        status: err.response?.status,
                        trace: err.response?.headers["x-b3-traceid"],
                    }
                }
            }
        } while (attempts > 0)
    }

    async sendProposalToPrevisul(proposal: any) {
        let attempts = 2
        let result = null
        let success = false
        let error
        let trace
        do {
            log.debug(`There are ${attempts} attempts left`)
            try {
                const response = await this.requestService.makeRequest(
                    this.requestService.ENDPOINTS.RESIDENTIAL_URL_SALE,
                    this.requestService.METHODS.POST,
                    proposal,
                    Tenants.RESIDENTIAL
                )
                result = response.data
                trace = response?.headers["x-b3-traceid"]
                success = true
                log.info("Success proposal sent")
                attempts = 0
            } catch (e: any) {
                const status = e.response?.status
                if (status === 401) {
                    log.debug("Not authorized, next attempt.")
                    await this.authTokenService.retrieveAuthorization(Tenants.RESIDENTIAL, true)
                    if (attempts === 1) {
                        log.debug("Authentication Token error")
                    }
                    attempts = attempts - 1
                } else {
                    result = null
                    log.debug(`Error %j`, e)
                    error = e
                    log.debug("Error when trying to send proposal")
                    log.debug(`Status Code: ${status}`)
                    log.debug(`x-b3-traceid: ${e.response?.headers["x-b3-traceid"]}`)
                    trace = e.response?.headers["x-b3-traceid"]
                    await this.delay(2)
                }
            }
            attempts = attempts - 1
        } while (attempts > 0)
        if (result) {
            return { result, trace, success }
        }
        throw `Proposal do not be sent, try ${3 - attempts} times; trace-id:${trace} ${error.toString()}`
    }

    static getDate = () => {
        const now = new Date()
        return {
            year: now.getUTCFullYear(),
            month: now.getUTCMonth() + 1,
            day: now.getUTCDate(),
            hour: now.getUTCHours(),
            minutes: now.getUTCMinutes(),
            humanDate: `${now.getUTCDate()}/${
                now.getUTCMonth() + 1
            }/${now.getUTCFullYear()} ${now.getUTCHours()}:${now.getUTCMinutes()}`,
            timestamp: now.getTime(),
        }
    }

    static detachProposal(amePayment) {
        if (amePayment.attributes?.customPayload?.proposal) {
            const proposal = Object.assign({}, amePayment.attributes?.customPayload?.proposal)
            if (proposal.pagamento && proposal.pagamento.numeroParcelas) {
                proposal.pagamento.numeroParcelas = ResidentialProposalService.processInstallments(amePayment)
            }
            if (proposal.pagamento) {
                proposal.pagamento.nsu = ResidentialProposalService.detatchNSU(amePayment)
            }
            return proposal
        } else {
            throw "The payment has not a proposal inside"
        }
    }

    async saveProposalSent(id: any, proposal: any) {
        log.debug("saveProposal")
        try {
            await this.residentialProposalRepository.create({
                email: id,
                proposal,
                transactionDateTime: ResidentialProposalService.getDate(),
            })
            log.debug("saveProposal:success")
            return true
        } catch (e: any) {
            log.debug("saveProposal:Fail")
            throw `Error on saving proposal:${e.message}`
        }
    }

    async saveProposalResponse(id: any, proposalResponse: any) {
        log.debug("saveProposalSentSuccess")
        try {
            await this.residentialProposalRepository.create({
                email: id + "_success",
                success: true,
                proposalResponse,
                transactionDateTime: ResidentialProposalService.getDate(),
            })
            log.debug("saveProposalSentSuccess:success")
        } catch (e: any) {
            log.debug("saveProposalSentSuccess:Fail")
            log.debug(e.message)
        }
    }

    async saveProposalFail(id: string, error: any) {
        log.debug("saveProposalSentFail")
        try {
            await this.residentialProposalRepository.create({
                email: id + "_fail",
                success: false,
                error: error,
                transactionDateTime: ResidentialProposalService.getDate(),
            })
            log.debug("saveProposalSentFail:success")
        } catch (e: any) {
            log.debug("saveProposalSentFail:Fail")
            log.debug(e.message)
        }
    }

    static detatchNSU(amePayment: any) {
        return amePayment.nsu || ""
    }

    static processInstallments(amePayment: any) {
        const installments = amePayment.splits?.map((i) => i.installments).filter((i) => i)
        let installmentsInfo
        if (installments.length) {
            installmentsInfo = parseInt(`${installments[0]}`)
        } else {
            installmentsInfo = 1
        }
        return installmentsInfo
    }

    async checkPrice(price: number, planId: string): Promise<any> {
        try {
            log.debug(`Checking Price from: value=${price} planId=${planId}`)
            const selectedPlan = Plans?.find((p) => p["id"] === planId)
            if (selectedPlan) {
                log.debug(`Real price of plan is ${selectedPlan["premio"]}`)
                const realPrice = Math.round(selectedPlan["premio"] * 100)
                const priceChecked = `${price}` === `${realPrice}`
                log.debug(`Price Check Result: ${priceChecked}`)
                return { checked: priceChecked, reason: { price, realPrice } }
            }
            log.debug(`Price Check not Match`)
            return { checked: false, reason: "Plan not found" }
        } catch (e: any) {
            return { checked: false, reason: "Error on price validation", error: e.toString() }
        }
    }

    async processProposal(signedPayment: string) {
        let proposalResponse: any
        const unsignedPayment = await this.authTokenService.unsignNotification(signedPayment)
        const proposal = ResidentialProposalService.detachProposal(unsignedPayment)
        await this.saveProposalSent(unsignedPayment.id, proposal)
        const checkPriceResult = await this.checkPrice(unsignedPayment.amount, proposal.planoId)
        if (checkPriceResult["checked"]) {
            log.debug("Price Match")
            try {
                proposalResponse = await this.sendProposalToPrevisul(proposal)
                await this.saveProposalResponse(unsignedPayment.id, proposalResponse)
            } catch (e: any) {
                await this.saveProposalFail(unsignedPayment.id, e.message ? e.message : e.toString())
            }
            log.info("Salvando a compra")
            await this.saveSoldProposal(unsignedPayment, proposalResponse, Tenants.RESIDENTIAL)
            log.debug("Proposal sent %j", unsignedPayment.id)
            return proposalResponse
        } else {
            log.debug("Price not Match")
            await this.saveProposalFail(unsignedPayment.id, checkPriceResult)
            throw "Price not match"
        }
    }

    async resendResidentialProposal(signedProposal: string) {
        const unsignedPayment = await this.authTokenService.unsignNotification(signedProposal)
        const proposalResponse = await this.sendProposalToPrevisul(unsignedPayment)
        return proposalResponse
    }

    async listProposal() {
        return this.residentialProposalRepository.listProposal()
    }

    async proposalReport(): Promise<Array<string>> {
        const proposalList = await this.residentialProposalRepository.listProposal()
        let proposalReport: Array<any>
        let response = [
            "Nome;Email;ID Plano;Parcelas;Vencimento;Início Vigência;Horário Servidor;Enviado Previsul;Protocolo Previsul;B2SkyTrace",
        ]
        try {
            proposalReport = proposalList
                .filter((x) => x.transactionDateTime)
                .map((proposal) => {
                    if (proposal.proposal) {
                        proposal.success_response = proposalList.find((y) => y.email === proposal.email + "_success")
                        proposal.error_response = proposalList.find((y) => y.email === proposal.email + "_error")
                        return proposal
                    }
                    return null
                })
                .filter((x) => x) // Removing empty results
                .sort((a, b) => a?.transactionDateTime?.timestamp - b?.transactionDateTime?.timestamp)
                .map((response) => {
                    const outputObject = {
                        nome: response?.proposal?.nome,
                        email: response?.proposal?.email,
                        planoId: response?.proposal?.planoId,
                        numeroParcelas: response?.proposal?.pagamento?.numeroParcelas,
                        dataVencimento: response?.proposal?.pagamento?.dataVencimento,
                        dataInicioVigencia: response?.proposal?.dataInicioVigencia,
                        horarioServidor: response?.transactionDateTime?.humanDate,
                        enviadoPrevisul: "",
                        PrevisulProtocolo: "",
                        b2skyLog: "",
                    }

                    if (response?.success_response) {
                        outputObject.enviadoPrevisul = "S"
                        outputObject.PrevisulProtocolo = response?.success_response?.proposalResponse?.result?.protocolo
                        outputObject.b2skyLog = response?.success_response?.proposalResponse?.trace
                    } else {
                        log.debug("Dont have success response")
                    }
                    if (response?.error_response) {
                        outputObject["enviadoPrevisul"] = "N"
                    } else {
                        log.debug("Dont have error response")
                    }
                    return outputObject
                })

            response = response.concat(
                proposalReport.map(
                    (p) =>
                        `${p.nome};${p.email};${p.planoId};${p.numeroParcelas};${p.dataVencimento};${p.dataVencimento};${p.horarioServidor};${p.enviadoPrevisul};${p.PrevisulProtocolo};${p.b2skyLog}`
                )
            )
        } catch (error) {
            log.error(error)
            response.push("Error on build report")
        }
        return response
    }

    async saveSoldProposal(proposal: any, response: any, tenant: string) {
        log.debug("saveSoldProposal")
        const apiVersion = process.env.COMMIT_HASH || "unavailable"
        await this.residentialSoldProposalRepository.create({
            customerId: proposal.attributes.customPayload.customerId,
            order: proposal.id,
            tenant: tenant,
            receivedPaymentNotification: proposal,
            partnerResponse: response,
            success: response?.success,
            createdAt: new Date().toISOString(),
            apiVersion,
            status: "PROCESSED",
        } as ResidentialSoldProposal)
        log.debug("saveSoldProposal:success")
    }

    delay(seconds) {
        log.debug(`Awaiting for ${seconds} seconds`)
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(null)
            }, seconds * 1000)
        })
    }
}
