import { inject, injectable } from "inversify"
import moment from "moment"
import { getLogger } from "../../../server/Logger"
import { AuthTokenService } from "../../authToken/services/AuthTokenService"
import { RequestService } from "../../authToken/services/RequestService"
import { healthCareProposalRepository } from "../repository/healthCareProposalRepository"
import { healthCareProposalSoldRepository } from "../repository/healthCareProposalSoldRepository"
import { Tenants } from "../../default/model/Tenants"

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
        const proposal = await this.authTokenService.unsignNotification(signedPayment)
        const formatedCotation = await this.formatCotation(proposal.attributes.customPayload.proposal)
        const cotation = await this.cotation(formatedCotation)
        log.info("Enviano a Adesão de HeathCare para o Parceiro")
        let processProposal: any = null

        if (cotation.success) {
            const formatedProposal = await this.formatProposal(proposal.attributes.customPayload.proposal)
            log.info("Enviano a Proposta de Pagamento do HeathCare para o Parceiro")
            processProposal = await this.proposalRequest(formatedProposal)
            await this.saveProposalResponse(proposal.id, proposal.attributes)
            await this.saveSoldProposal(proposal, processProposal)
        } else {
            processProposal = {
                success: false,
                message: "Erro de cadastro do usuário",
                error: cotation?.msg,
            }
        }
        return processProposal
    }

    async saveProposalResponse(id: any, proposalResponse: any) {
        try {
            await this.healthCareProposalRepository.create({
                id: id,
                success: true,
                proposalResponse,
                transactionDateTime: new Date().toISOString(),
            })
            log.debug("saveProposalSentSuccess:success")
        } catch (e) {
            log.debug("saveProposalSentSuccess:Fail")
            log.debug(e.message)
        }
    }

    async saveSoldProposal(proposal: any, response: any) {
        log.debug("saveSoldProposal")
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

    async cotation(cotation: any) {
        log.info("Sending HeatlCare Cotation to Partner")
        let result
        try {
            const response = await this.requestService.makeRequest(
                this.requestService.ENDPOINTS.HEALTHCARE_URL_BASE,
                this.requestService.METHODS.POST,
                cotation,
                Tenants.HEALTHCARE,
                "/adesao"
            )
            if (response.data.status === "200") {
                result = { success: true, content: response.data }
                log.info("Success HeathCarea Cotation sent")
            } else {
                result = { success: false, content: response.data }
                log.error("HeathCarea Cotation Error")
            }
        } catch (e) {
            const status = e.response?.status
            const statusText = e.response
            result = { success: false, status: status, message: statusText }
            log.error(`Error %j`, statusText)
            log.debug("Error when trying to send Cotation")
            log.debug(`Status Code: ${status}`)
        }

        return result
    }

    async proposalRequest(proposal: any) {
        log.info("Sending HeatlCare proposal to Partner")
        let result
        try {
            const response = await this.requestService.makeRequest(
                this.requestService.ENDPOINTS.HEALTHCARE_URL_BASE,
                this.requestService.METHODS.POST,
                proposal,
                Tenants.HEALTHCARE,
                "/pagamento"
            )
            if (response.data.status === "200") {
                result = { success: true, content: response.data }
                log.info("Success HeathCarea proposal sent")
            } else {
                result = { success: false, content: response.data }
                log.error("HeathCarea proposal Error")
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

    async cancel(request: any) {
        const cancelPropose = await this.cancelPropose(request)
        log.info("Send HealthCare CancelProposal do Partner")
        if (cancelPropose.success) {
            log.info("Success to send HealthCare CancelProposal do Partner")
            // const cancelSoldProposal = await this.cancelSoldProposal(request)
            return {
                success: true,
                message: "Usuario cancelado com sucesso",
            }
        } else {
            log.error("Error to send HealthCare CancelProposal do Partner")
            return {
                success: false,
                message: "Não foi possível salvar os dados de HealthCare",
            }
        }
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
        const cancelPropose = { receivedCanceledNotification: request, status: "CANCELED" }
        const cancelSoldProposal = await this.healthCareProposalSoldRepository.cancel(cancelPropose, request.customerId)
        log.info("Save HeatlCare proposal Cancel to soldProposal")
        return cancelSoldProposal
    }

    async formatCotation(request: any) {
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
        return {
            ID_CLIENTE_CONTRATO: 100577816,
            ID_CLIENTE: 10067,
            NOME: request.name,
            CPF: request.cpf,
            STATUS_PAGAMENTO: "PG",
            CODIGO_PLANO: "54",
            DATA_PAGAMENTO: moment().format("DD/MM/YYYY"),
            ID_FORMA_PAGAMENTO: "30",
            VALOR_PAGAMENTO: "61,88",
            MES_COMPETENCIA: moment().format("MM/YYYY"),
        }
    }
}