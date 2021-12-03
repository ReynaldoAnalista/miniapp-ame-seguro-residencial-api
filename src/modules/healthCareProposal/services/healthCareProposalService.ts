import { inject, injectable } from "inversify"
import moment from "moment"
import { getLogger } from "../../../server/Logger"
import { AuthTokenService } from "../../authToken/services/AuthTokenService"
import { RequestService } from "../../authToken/services/RequestService"
import { healthCareProposalRepository } from "../repository/healthCareProposalRepository"
import { healthCareProposalSoldRepository } from "../repository/healthCareProposalSoldRepository"
import { Tenants } from "../../default/model/Tenants"
import path from "path"
import util from "util"
import fs from "fs"

const readFile = util.promisify(fs.readFile)

const log = getLogger("healthCareProposalService")

@injectable()
export class HealthCareProposalService {
    constructor(
        @inject("AuthTokenService")
        private authTokenService: AuthTokenService,
        @inject("RequestService")
        private requestService: RequestService,
        @inject("healthCareProposalRepository")
        private healthCareProposalRepository: healthCareProposalRepository,
        @inject("healthCareProposalSoldRepository")
        private healthCareProposalSoldRepository: healthCareProposalSoldRepository
    ) {}

    async proposal(signedPayment: any) {
        const unsignedPayment = await this.authTokenService.unsignNotification(signedPayment)
        const { proposal } = unsignedPayment.attributes.customPayload
        const formatedCotation = await this.formatCotation(proposal)
        await this.sendCotation(formatedCotation)
        const formatedProposal = await this.formatProposal(proposal)
        const proposalResponse = await this.sendProposal(formatedProposal)
        // await this.saveProposalResponse(unsignedPayment.id, unsignedPayment.attributes)
        await this.saveSoldProposal(unsignedPayment, proposalResponse)
        return proposalResponse
    }

    async saveProposalResponse(id: any, proposalResponse) {
        log.info("Saving proposal response")
        await this.healthCareProposalRepository.create({
            id: id,
            success: true,
            proposalResponse,
            transactionDateTime: new Date().toISOString(),
        })
        log.debug("saveProposalSentSuccess:success")
    }

    async saveSoldProposal(proposal: any, response) {
        log.debug("Saving soldProposal")
        const apiVersion = process.env.COMMIT_HASH || "unavailable"
        await this.healthCareProposalSoldRepository.create({
            customerId: proposal.attributes.customPayload.customerId,
            order: proposal.id,
            tenant: Tenants.HEALTHCARE,
            receivedPaymentNotification: proposal,
            partnerResponse: response,
            success: response?.success,
            createdAt: new Date().toISOString(),
            apiVersion,
            status: "PROCESSED",
        })
        log.debug("saveSoldProposal:success")
    }

    async sendCotation(cotation: any) {
        log.info("Sending HealthCare Cotation to Partner")
        const response = await this.requestService.makeRequest(
            this.requestService.ENDPOINTS.HEALTHCARE_URL_BASE,
            this.requestService.METHODS.POST,
            cotation,
            Tenants.HEALTHCARE,
            "/adesao"
        )
        if (response.data.status === "200") {
            log.info("Success HeathCarea Cotation sent")
            return { success: true, content: response.data }
        } else {
            log.error("HealthCarea Cotation Error")
            throw new Error("HealthCarea Cotation Error")
        }
    }

    async sendProposal(proposal: any) {
        log.info("Sending HeatlCare proposal to Partner")
        const response = await this.requestService.makeRequest(
            this.requestService.ENDPOINTS.HEALTHCARE_URL_BASE,
            this.requestService.METHODS.POST,
            proposal,
            Tenants.HEALTHCARE,
            "/pagamento"
        )
        if (response.data.status === "200") {
            log.info("Success HeathCarea proposal sent")
            return { success: true, content: response.data }
        } else {
            log.error("HeathCarea proposal Error")
            throw new Error("HeathCarea proposal Error")
        }
    }

    async cancel(request: any) {
        const cancelPropose = await this.cancelPropose(request)
        log.info("Send HealthCare CancelProposal do Partner")
        if (cancelPropose.success) {
            log.info("Success to send HealthCare CancelProposal do Partner")
            const cancelSoldProposal = await this.cancelSoldProposal(request)
            if (cancelSoldProposal.success) {
                return {
                    success: true,
                    message: "Usuario cancelado com sucesso",
                }
            }
        }
        return {
            success: false,
            message: "Não foi possível salvar os dados de HealthCare",
        }
    }

    async cotation(request: any) {
        const cotation = await readFile(path.resolve(__dirname, "../../../files/health_care_cotation.json"), "utf-8")
        const cotationObject = JSON.parse(cotation)
        const finalCotation = cotationObject.filter(function (x) {
            return request.age >= x.min && request.age <= x.max
        })
        return finalCotation
    }

    async cancelPropose(request: any) {
        const requestCancel = {
            ID_CONTRATO_PLANO: 100577816,
            ID_CLIENTE: 10067,
            CPF: request.cpf,
            CODIGO_EXTERNO: request.customerId,
        }

        let result
        try {
            const response = await this.requestService.makeRequest(
                this.requestService.ENDPOINTS.HEALTHCARE_URL_BASE,
                this.requestService.METHODS.POST,
                requestCancel,
                Tenants.HEALTHCARE,
                "/cancelamento"
            )
            if (response.data.status === "200") {
                result = { success: true, content: response.data }
                log.info("Success HeathCarea Cancel proposal sent")
            } else {
                result = { success: false, content: response.data }
                log.error("HeathCarea Cancel proposal Error")
            }
        } catch (e) {
            const status = e.response?.status
            const statusText = e.response?.statusText
            result = { success: false, status: status, message: statusText }
            log.error(`Error %j`, statusText)
            log.debug("Error when trying to send proposal")
            log.debug(`Status Code: ${status}`)
        }
        return result
    }

    async cancelSoldProposal(request) {
        const cancelSoldProposal = await this.healthCareProposalSoldRepository.cancel(request)
        log.info("Update HealthCare proposal Cancel to soldProposal")
        return cancelSoldProposal
    }

    async formatCotation(request: any) {
        log.info("Formatando cotação para envio")
        return {
            ID_CONTRATO_PLANO: 100577816,
            ID_BENEFICIARIO_TIPO: 1,
            NOME: request.name,
            CODIGO_EXTERNO: "1111111111",
            CPF_TITULAR: " ",
            ID_CLIENTE: 10067,
            CPF: request.cpf,
            RG: " ",
            DATA_NASCIMENTO: moment(request.birthDate, "YYYY-MM-DD").format("DDMMYYYY"),
            SEXO: request.sex,
            NOME_MAE: "",
            TELEFONE_FIXO: "",
            TELEFONE_COMERCIAL: "",
            CELULAR: request.phoneNumber,
            EMAIL: request.email,
            CEP: request.address.cep,
            LOGRADOURO: request.address.publicPlace,
            NUMERO: request.address.number,
            COMPLEMENTO: request.address.complement,
            BAIRRO: request.address.street,
            CIDADE: request.address.city,
            UF: request.address.uf,
            TIPO_PLANO: "54",
        }
    }

    async formatProposal(request: any) {
        log.info("Formatando proposta para envio")
        return {
            ID_CLIENTE_CONTRATO: 100577816,
            ID_CLIENTE: 10067,
            NOME: request.name,
            CPF: request.cpf,
            STATUS_PAGAMENTO: "PG",
            CODIGO_PLANO: "54",
            DATA_PAGAMENTO: moment().format("DD/MM/YYYY"),
            ID_FORMA_PAGAMENTO: "32",
            VALOR_PAGAMENTO: "61,88",
            MES_COMPETENCIA: moment().format("MM/YYYY"),
        }
    }
}
