import { inject, injectable } from "inversify"
import { getLogger } from "../../../server/Logger"
import { TYPES } from "../../../inversify/inversify.types"
import { AuthTokenService } from "../../authToken/services/AuthTokenService"
import { RequestService } from "../../authToken/services/RequestService"
import { ResidentialProposalRepository } from "../repository/ResidentialProposalRepository"
import { ParameterStore } from "../../../configs/ParameterStore"
import Plans from "./Plans"
import { ResidentialSoldProposalRepository } from "../repository/ResidentialSoldProposalRepository"
import { Tenants } from "../../default/model/Tenants"
import { ResidentialSoldProposal } from "../model/ResidentialSoldProposal"

const log = getLogger("ResidentialMaintenanceService")

@injectable()
export class ResidentialMaintenanceService {
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

    async showProposalStatus(paymentId: string) {
        log.debug("showProposalStatus")
        const proposalData = await this.residentialProposalRepository.findByEmail(paymentId)
        const successData = await this.residentialProposalRepository.findByEmail(`${paymentId}_success`)
        const failData = await this.residentialProposalRepository.findByEmail(`${paymentId}_fail`)
        return { proposalData, successData, failData }
    }

    async showSoldProposalStatus(customerId: string) {
        log.debug("showProposalStatus")
        const proposalData = await this.residentialSoldProposalRepository.findAllFromCustomer(customerId)
        return { proposalData }
    }

    async generateSoldProposal(version: string, paymentId: string, customerId: string) {
        const proposalData = await this.residentialProposalRepository.findByEmail(paymentId)
        const successData = await this.residentialProposalRepository.findByEmail(`${paymentId}_success`)
        const failData = await this.residentialProposalRepository.findByEmail(`${paymentId}_fail`)
        if (Array.isArray(proposalData) && proposalData.length) {
            return proposalData.map((data, index) => {
                if (version === "1") {
                    // Trabalhando o primeiro modelo
                    return {
                        tenant: "RESIDENTIAL",
                        success: true,
                        status: "PROCESSED",
                        createdAt: new Date().toISOString(),
                        order: paymentId,
                        apiVersion: process.env.COMMIT_HASH || "unavailable",
                        customerId: customerId,
                        fromMigration: true,
                        partnerResponse: {
                            result: data.proposalProtocol,
                            trace: "LOST_IN_PROCESS",
                            success: true,
                        },
                        receivedPaymentNotification: {
                            date: [],
                            cashType: "",
                            amount: 0,
                            debitWalletId: "",
                            splits: [],
                            description: "",
                            title: "",
                            type: "PAYMENT",
                            nsu: "",
                            peer: null,
                            amountRefunded: 0,
                            name: "Compra on-line",
                            operationType: "",
                            currency: "BRL",
                            attributes: {
                                vbaMethod: "",
                                orderId: paymentId,
                                isVerified: null,
                                origin: "MINIAPP",
                                miniApp: {
                                    id: "ame-seguro-residencial",
                                    hasOrderDetails: false,
                                },
                                paymentOnce: false,
                                cashbackAmountValue: 0,
                                items: [
                                    {
                                        description: "Seguro",
                                        amount: 0,
                                        quantity: 1,
                                    },
                                ],
                                customPayload: {
                                    clientCallbackUrl:
                                        "https://miniapps.amedigital.com/ame-seguro-residencial/v1/plans/sendProposal",
                                    proposal: data.proposal,
                                    miniAppId: "559",
                                    isFrom: "mini-app-ame-seguro-residencial",
                                    customerId: customerId,
                                    timestamp: "",
                                },
                                transactionChangedCallbackUrl: "",
                            },
                            operationReference: null,
                            id: paymentId,
                            status: "AUTHORIZED",
                        },
                    }
                }
                if (version === "2" && Array.isArray(successData)) {
                    return {
                        tenant: "RESIDENTIAL",
                        success: true,
                        status: "PROCESSED",
                        createdAt: new Date().toISOString(),
                        order: paymentId,
                        apiVersion: process.env.COMMIT_HASH || "unavailable",
                        customerId: customerId,
                        fromMigration: true,
                        partnerResponse: successData[index].proposalResponse,
                        receivedPaymentNotification: {
                            date: [],
                            cashType: "",
                            amount: 0,
                            debitWalletId: "",
                            splits: [],
                            description: "",
                            title: "",
                            type: "PAYMENT",
                            nsu: "",
                            peer: null,
                            amountRefunded: 0,
                            name: "Compra on-line",
                            operationType: "",
                            currency: "BRL",
                            attributes: {
                                vbaMethod: "",
                                orderId: paymentId,
                                isVerified: null,
                                origin: "MINIAPP",
                                miniApp: {
                                    id: "ame-seguro-residencial",
                                    hasOrderDetails: false,
                                },
                                paymentOnce: false,
                                cashbackAmountValue: 0,
                                items: [
                                    {
                                        description: "Seguro",
                                        amount: 0,
                                        quantity: 1,
                                    },
                                ],
                                customPayload: {
                                    clientCallbackUrl:
                                        "https://miniapps.amedigital.com/ame-seguro-residencial/v1/plans/sendProposal",
                                    proposal: data.proposal,
                                    miniAppId: "559",
                                    isFrom: "mini-app-ame-seguro-residencial",
                                    customerId: customerId,
                                    timestamp: "",
                                },
                                transactionChangedCallbackUrl: "",
                            },
                            operationReference: null,
                            id: paymentId,
                            status: "AUTHORIZED",
                        },
                    }
                }
            })
        }
    }
}
