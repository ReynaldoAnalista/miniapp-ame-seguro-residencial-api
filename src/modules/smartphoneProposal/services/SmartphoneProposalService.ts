import { inject, injectable } from "inversify"
import { getLogger } from "../../../server/Logger"
import { AuthTokenService } from "../../authToken/services/AuthTokenService"
import { RequestService } from "../../authToken/services/RequestService"
import { SmartphoneProposalRepository } from "../repository/SmartphoneProposalRepository"
import { SmartphoneProposalResponseRepository } from "../repository/SmartphoneProposalResponseRepository"
import { SmartphoneSoldProposal } from "../model/SmartphoneSoldProposal"
import { SmartphoneSoldProposalRepository } from "../repository/SmartphoneSoldProposalRepository"
import { Tenants } from "../../default/model/Tenants"
import { SmartphoneProposalUtils } from "./SmartphoneProposalUtils"
import { SmartphoneProposalMailService } from "./SmartphoneProposalMailService"
import { SoldProposalStatus } from "../../default/model/SoldProposalStatus"
import { DigibeeConfirmation } from "../model/DigibeeConfirmation"
import { AmePaymentService } from "../../ame/services/AmePaymentService"
import moment from "moment"
import { ParameterStore } from "../../../configs/ParameterStore"

const log = getLogger("SmartphoneProposalService")

@injectable()
export class SmartphoneProposalService {
    constructor(
        @inject("AuthTokenService")
        private authTokenService: AuthTokenService,
        @inject("RequestService")
        private requestService: RequestService,
        @inject("SmartphoneProposalRepository")
        private smartphoneProposalRepository: SmartphoneProposalRepository,
        @inject("SmartphoneSoldProposalRepository")
        private smartphoneSoldProposalRepository: SmartphoneSoldProposalRepository,
        @inject("SmartphoneProposalResponseRepository")
        private responseRepository: SmartphoneProposalResponseRepository,
        @inject("SmartphoneProposalMailService")
        private mailService: SmartphoneProposalMailService,
        @inject("AmePaymentService")
        private amePaymentService: AmePaymentService,
        @inject("ParameterStore")
        private parameterStore: ParameterStore
    ) {}

    async processProposal(signedPayment: string) {
        const unsignedPayment = await this.authTokenService.unsignNotification(signedPayment)
        log.info("Salvando o arquivo da notifica????o")
        await this.saveProposal(unsignedPayment)
        log.info("Separando o arquivo da proposta")
        const proposal = SmartphoneProposalUtils.generateProposal(unsignedPayment)
        log.info("Enviando a proposta para a digibee")
        const proposalResponse = await this.sendProposal(proposal)
        log.info("Salvando a resposta da digibee")
        await this.saveProposalResponse(proposalResponse, unsignedPayment.id)
        log.info("Salvando a compra")
        await this.saveSoldProposal(unsignedPayment, proposalResponse, Tenants.SMARTPHONE)
        log.info("Enviando o email ao cliente")
        await this.mailService.sendSellingEmailByPaymentObject(unsignedPayment)
        log.info("Retornando a proposta")
        return proposalResponse
    }

    async updateProposal(proposalId: string, notSendToDigibee = false) {
        const proposalRequest = await this.smartphoneProposalRepository.findByID(proposalId)
        log.info("Recebendo a proposta", proposalId)
        const proposal = SmartphoneProposalUtils.generateProposal(proposalRequest)
        log.info("Enviando a proposta para a digibee")
        const proposalResponse = await this.sendProposal(proposal)
        if (notSendToDigibee == false) {
            await this.updateProposalResponse(proposalRequest)
            log.info("Recebendo a resposta da digibee")
        }
        log.info("Atualizando a compra")
        await this.updateSoldProposal(proposalRequest, proposalResponse, Tenants.SMARTPHONE)
        log.info("Enviando o email ao cliente")
        await this.mailService.sendSellingEmailByPaymentObject(proposalRequest)
        log.info("Retornando a proposta")
        return proposalResponse
    }

    async findFromCostumerOrder(customerId, order) {
        const findFromCostumerOrder = this.smartphoneSoldProposalRepository.findAllFromCustomerAndOrder(customerId, order)
        return findFromCostumerOrder
    }

    async findByNsu(nsu) {
        const findByNsu = await this.smartphoneSoldProposalRepository.findByNsu(nsu)
        return findByNsu
    }

    async updateManyProposal(proposal: any) {
        try {
            if (typeof proposal.ordersToSend != undefined && proposal.ordersToSend.length > 0) {
                let successCount = 0
                let missCount = 0
                await proposal.ordersToSend.forEach(async (proposalId) => {
                    const proposalRequest = await this.smartphoneProposalRepository.findByID(proposalId)
                    if (proposalRequest) {
                        log.info("Recebendo a proposta", proposalId)
                        const proposal = SmartphoneProposalUtils.generateProposal(proposalRequest)
                        log.info("Enviando a proposta para a digibee")
                        const proposalResponse = await this.sendProposal(proposal)
                        if (proposalResponse.success) {
                            successCount += 1
                        } else {
                            missCount += 1
                        }
                        await this.updateProposalResponse(proposalRequest)
                        log.info("Recebendo a resposta da digibee")
                        log.info("Proposta validada pela digibee")
                        await this.updateSoldProposal(proposalRequest, proposalResponse, Tenants.SMARTPHONE)
                        log.info("Atualizando a compra no SoldProposal")
                        log.info(`Ordem de Id: ${proposalId} Executada com sucesso`)
                    }
                })
                return {
                    message: `${successCount} Ordens executadas com sucesso, ${missCount} Ordens falharam`,
                    status: 200,
                }
            }
            return {
                message: "Nenhuma ordem foi encontrada",
                status: 400,
            }
        } catch (e) {
            log.error("Erro de execu????o: ", e.message)
            return {
                message: "Erro na execu????o das ordens",
                status: 400,
            }
        }
    }

    async updateOldCustumersProposal(proposalId: string) {
        const proposalRequest = await this.smartphoneProposalRepository.findByID(proposalId)
        log.info("Recebendo a proposta de ID", proposalId)

        await this.updateProposalResponse(proposalRequest)
        log.info("Atualizando a ProposalResponse")

        // Resposta da DigiBee mokada
        const soldProposalResponse = {
            success: true,
            content: {
                msg: "Proposta recebida com sucesso. Ser?? processada em modo batch nos hor??rios pre-estabelecidos",
                mother_policy_number: "2716000020171",
                success: true,
            },
        }

        const soldProposal = await this.updateSoldProposal(proposalRequest, soldProposalResponse, Tenants.SMARTPHONE)
        log.info("Atualizando a SoldProposal")

        return soldProposal
    }

    async saveProposal(proposal: any): Promise<void> {
        log.debug("Saving proposal to DynamoDB")
        try {
            await this.smartphoneProposalRepository.create(proposal)
        } catch (e) {
            log.error(e)
            throw "Erro ao criar registro no Dynamo DB"
        }
    }

    async sendProposal(proposal: any) {
        log.debug("Sending proposal to Partner")
        let result
        try {
            const response = await this.requestService.makeRequest(
                this.requestService.ENDPOINTS.SMARTPHONE_URL_SALE,
                this.requestService.METHODS.POST,
                proposal,
                Tenants.SMARTPHONE
            )
            result = { success: true, content: response.data }
            log.info("Success proposal sent")
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

    async updateNsuByCustumerAndOrder(custumerInfo: any) {
        return await this.smartphoneSoldProposalRepository.updateNsuByCustumerAndOrder(
            custumerInfo.customerId,
            custumerInfo.order
        )
    }

    async saveProposalResponse(proposal: any, id: string) {
        log.debug("saveProposalResponse")
        try {
            await this.responseRepository.create({ id, ...proposal })
            log.debug("saveProposalResponse:success")
        } catch (e) {
            log.debug("saveProposalResponse:Fail")
            log.error(e)
        }
    }

    async updateProposalResponse(proposal: any) {
        log.debug("updateProposalResponse")
        try {
            await this.responseRepository.update(proposal)
            log.debug("updateProposalResponse:success")
        } catch (e) {
            log.debug("updateProposalResponse:Fail")
            log.error(e)
        }
    }

    async saveSoldProposal(proposal: any, response, tenant: string) {
        log.debug("saveSoldProposal")
        try {
            const apiVersion = process.env.COMMIT_HASH || "unavailable"
            await this.smartphoneSoldProposalRepository.create({
                customerId: proposal.attributes.customPayload.customerId,
                order: proposal.id,
                tenant: tenant,
                createdAt: new Date().toISOString(),
                success: response.success,
                partnerResponse: response,
                apiVersion,
                status: SoldProposalStatus.create,
                receivedPaymentNotification: proposal,
                NSU: proposal?.nsu,
            } as SmartphoneSoldProposal)
            log.debug("saveSoldProposal:success")
        } catch (e) {
            log.debug("saveSoldProposal:Fail")
            log.error(e)
        }
    }

    async saveCancelProposal(proposal: any, response, tenant: string) {
        log.debug("saveSoldProposal")

        try {
            const apiVersion = process.env.COMMIT_HASH || "unavailable"
            await this.smartphoneSoldProposalRepository.update({
                customerId: proposal.customerId,
                order: proposal.order,
                tenant: tenant,
                createdAt: new Date().toISOString(),
                success: response.success,
                partnerResponse: response,
                apiVersion,
                status: SoldProposalStatus.cancel,
                receivedPaymentNotification: proposal,
            } as SmartphoneSoldProposal)
            log.debug("saveSoldProposal:success")
        } catch (e) {
            log.debug("saveSoldProposal:Fail")
            log.error(e)
        }
    }

    async updateStatusSoldProposal(customerId: string, order: string) {
        log.debug("Buscando proposta pelo Id updateSoldProposal ")
        try {
            const getResponse = await this.smartphoneSoldProposalRepository.findAllFromCustomerAndOrder(customerId, order)
            if (typeof getResponse == "undefined") {
                log.debug("updateSoldProposal:Fail")
                return
            }
            const proposalRequest = getResponse[0]
            await this.smartphoneSoldProposalRepository.update({
                partnerResponse: proposalRequest?.partnerResponse,
                createdAt: proposalRequest?.createdAt,
                apiVersion: proposalRequest?.apiVersion,
                success: true,
                customerId: proposalRequest?.customerId,
                receivedPaymentNotification: proposalRequest?.receivedPaymentNotification,
                tenant: Tenants.SMARTPHONE,
                order: proposalRequest?.order,
                status: SoldProposalStatus.update,
            } as SmartphoneSoldProposal)
            log.debug("updateSoldProposal:success")
        } catch (e) {
            log.debug("updateSoldProposal:Fail")
            log.error(e)
        }
    }

    async sendSellingEmail(pass: string, forceEmail?: string) {
        log.debug(`Sending email: ${pass}`)
        const paymentObject = await this.smartphoneProposalRepository.findByID(pass)
        if (paymentObject) {
            const proposal = SmartphoneProposalUtils.generateProposal(paymentObject)

            let proposalResponse = await this.responseRepository.findByID(pass)
            if (!proposalResponse) {
                log.info("Sem response, enviando para Digibee")
                proposalResponse = await this.sendProposal(proposal)
            }

            log.info("Atualizando a tabela SoldProposal")
            await this.updateSoldProposal(proposal, proposalResponse, Tenants.SMARTPHONE)

            log.info("Enviando o E-mail")
            return await this.mailService.sendSellingEmailByPaymentObject(paymentObject, forceEmail)
        }
        log.error("Order not found")
        throw new Error("Order not found")
    }

    async updateSoldProposal(proposal: any, response, tenant: string) {
        log.debug("updateSoldProposal")
        try {
            await this.smartphoneSoldProposalRepository.update({
                customerId: proposal.attributes.customPayload.customerId,
                order: proposal.id,
                tenant: tenant,
                receivedPaymentNotification: proposal,
                partnerResponse: response,
                success: response.success,
                createdAt: new Date().toISOString(),
            } as SmartphoneSoldProposal)
            log.debug("updateSoldProposal:success")
        } catch (e) {
            log.debug("updateSoldProposal:Fail")
            log.error(e)
        }
    }

    async validateMailProposal(proposalId: string) {
        const proposal = await this.smartphoneProposalRepository.findByID(proposalId)
        const validateMail = await this.smartphoneProposalRepository.validateProposal(proposal)
        if (validateMail.length > 0) {
            return {
                message: "Campos inv??lidos",
                invalid_fields: validateMail,
                valid: false,
            }
        }
        return {
            message: "E-mail validado com sucesso",
            invalid_fields: "",
            valid: true,
        }
    }

    async customerCertificateNumber() {
        return await this.smartphoneSoldProposalRepository.findcertificateNumber()
    }

    async cancelationProcessWithOrder(orderProposal) {
        const soldProposal = await this.smartphoneSoldProposalRepository.findAllFromCustomerAndOrder(
            orderProposal.customerId,
            orderProposal.order
        )
        const updateSoldProposal = soldProposal?.map((x) => {
            return {
                customerId: x.customerId,
                order: x.order,
                partnerResponse: x.partnerResponse,
                createdAt: new Date().toISOString(),
                success: true,
                receivedPaymentNotification: x.receivedPaymentNotification,
                tenant: Tenants.SMARTPHONE,
                status: "CANCELED",
                NSU: x.receivedPaymentNotification?.nsu,
            }
        })[0]
        return await this.smartphoneSoldProposalRepository.update(updateSoldProposal)
    }

    async cancelationProcess(signedPayment: any) {
        let unsignedPayment: any
        if (!signedPayment.unsigned || typeof signedPayment.unsigned == "undefined") {
            unsignedPayment = await this.authTokenService.unsignNotification(signedPayment.signedPayment)
        } else {
            unsignedPayment = signedPayment
        }
        const formatedCancelProposal = await this.smartphoneSoldProposalRepository.formatCancelProposal(unsignedPayment)

        if (!formatedCancelProposal) {
            return {
                success: false,
                error: "N??o foi poss??vel encontrar informa????es na base",
            }
        }

        let result
        try {
            const response = await this.requestService.makeRequest(
                this.requestService.ENDPOINTS.SMARTPHONE_URL_CANCEL,
                this.requestService.METHODS.POST,
                formatedCancelProposal,
                Tenants.SMARTPHONE
            )
            result = { proposal: formatedCancelProposal, response: response.data, success: true }
            log.debug("Salvando o cancelamento na soldProposal")
            await this.refundProcess(unsignedPayment)
            await this.saveCancelProposal(unsignedPayment, result, Tenants.SMARTPHONE)
            log.info("Success proposal cancel")
            return result
        } catch (e) {
            const result = { success: false, error: e.message }
            log.error(`Error %j`, e.message)
            log.debug("Error when trying to cancel proposal")
            return result
        }
    }

    async refundProcess(unsignedPayment) {
        const proposal = await this.smartphoneSoldProposalRepository.findAllFromCustomerAndOrder(
            unsignedPayment.customerId,
            unsignedPayment.order
        )
        const refundedPayment = await this.refundPaymentProcess(proposal)

        const refundContent = {
            paymentId: unsignedPayment.order, // id da ordem
            walletToken: await this.parameterStore.getSecretValue("MINIAPP_KEY"),
            amount: refundedPayment,
        }
        const refundToWallet = await this.amePaymentService.refund(refundContent)
        return refundToWallet
    }

    async refundPaymentProcess(data) {
        const soldDate = moment(data[0].createdAt, "YYYY-MM-DD")
        const liquidPrice = data[0].receivedPaymentNotification.attributes.customPayload.proposal.coverage_data.liquid_prize
        const usedPrice: any = ((liquidPrice / 365) * moment().diff(soldDate.add(1, "days"), "days")).toFixed(2)
        const prizeBeRefunded = parseInt((Math.abs(usedPrice - liquidPrice) * 100).toFixed())
        if (moment().diff(soldDate, "days") <= 7) {
            return parseInt((liquidPrice * 100 * 1.0738).toFixed())
        }
        return prizeBeRefunded
    }

    async confirmProposal(digibeeConfirmation: DigibeeConfirmation) {
        const dataInfo = digibeeConfirmation.control_data
        const soldProposal = await this.smartphoneSoldProposalRepository.findByNsu(dataInfo.customer_identifier_code)
        if (soldProposal) {
            log.info("Buscando informa????es na tabela SoldProposal")
            const requestProposal = soldProposal?.find(
                (x) => x.receivedPaymentNotification.nsu === dataInfo.customer_identifier_code
            )
            log.info("Filtrando o dado que possuo o mesmo NSU e Codigo do Cliente")
            if (requestProposal) {
                requestProposal.acceptance_type = dataInfo.acceptance_type == "Aceito" ? true : false
                requestProposal.control_data = digibeeConfirmation
                await this.smartphoneSoldProposalRepository.update(requestProposal)
                log.info("Salvando atualiza????o na tabela SoldProposal")
                return {
                    message: "Proposta atualizada com sucesso",
                    status: 200,
                }
            } else {
                log.error("Sem propostas com NSU especificado")
                return {
                    message: "NSU n??o encontrato para este cliente",
                    status: 403,
                }
            }
        } else {
            log.error("Erro ao coletar as informa????es na tabela SoldProposal")
            return {
                message: "Cliente n??o encontrato",
                status: 404,
            }
        }
    }

    async processIOF(compraId: string) {
        const proposal = await this.smartphoneProposalRepository.findByID(compraId)
        const amount = proposal?.amount
        const withoutIOF = Math.round(amount / 1.0734) / 100
        if (amount) {
            if (proposal?.attributes?.customPayload?.proposal?.coverage_data) {
                proposal.attributes.customPayload.proposal.coverage_data.liquid_prize = withoutIOF
                this.smartphoneProposalRepository.update(proposal)
                return {
                    id: proposal?.id,
                    preco_cobrado: (proposal?.attributes.customPayload.proposal.coverage_data.liquid_prize * 1.0734).toFixed(2),
                    preco_liquido: proposal?.attributes.customPayload.proposal.coverage_data.liquid_prize,
                }
            }
        }
    }
}
