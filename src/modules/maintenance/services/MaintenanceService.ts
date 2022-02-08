import { inject, injectable } from "inversify"
import { getLogger } from "../../../server/Logger"
import { AuthTokenService } from "../../authToken/services/AuthTokenService"
import { SmartphoneProposalRepository } from "../../smartphoneProposal/repository/SmartphoneProposalRepository"
import { SmartphoneProposalMailService } from "../../smartphoneProposal/services/SmartphoneProposalMailService"
import { MaintenanceRepository } from "../repository/MaintenanceRepository"
import { MaintenanceSoldProposal } from "../model/MaintenanceSoldProposal"

const log = getLogger("MaintenanceService")

@injectable()
export class MaintenanceService {
    constructor(
        @inject("SmartphoneProposalRepository")
        private smartphoneProposalRepository: SmartphoneProposalRepository,
        @inject("SmartphoneProposalMailService")
        private smartphoneProposalMailService: SmartphoneProposalMailService,
        @inject("MaintenanceRepository")
        private maintenanceRepository: MaintenanceRepository,
        @inject("AuthTokenService")
        private authTokenService: AuthTokenService
    ) {}

    async sendSellingEmailWithParams(pass: string, email: string) {
        log.debug(`Sending email: ${pass}`)
        const paymentObject = await this.smartphoneProposalRepository.findByID(pass)
        if (paymentObject) {
            return await this.smartphoneProposalMailService.sendSellingEmailByPaymentObject(paymentObject, email)
        }
        log.error("Order not found")
        throw new Error("Order not found")
    }

    async updateOrdersType(signedUpdatePlanStatus: string) {
        const unsignedNotification = await this.authTokenService.unsignNotification(signedUpdatePlanStatus)
        try {
            unsignedNotification.map(async (item) => {
                await this.maintenanceRepository.updateSoldProposalOrdersType(item)
            })
        } catch (e) {
            log.error("Erro na atualização", e.message)
            throw new Error("Erro na atualização")
        }
        return {
            success: true,
            message: `Orders Updated`,
        }
    }

    async getCancelledOrders(customerId) {
        return await this.maintenanceRepository.getCancelledOrder(customerId)
    }

    async insertSoldProposal(signedProposal: string) {
        const unsignedInfo = await this.authTokenService.unsignNotification(signedProposal)
        const proposal = await this.maintenanceRepository.create({
            customerId: unsignedInfo?.customerId,
            order: unsignedInfo?.order,
            tenant: unsignedInfo?.tenant,
            receivedPaymentNotification: unsignedInfo?.receivedPaymentNotification,
            partnerResponse: unsignedInfo?.partnerResponse,
            success: true,
            createdAt: unsignedInfo?.createdAt,
            status: unsignedInfo?.status,
            apiVersion: unsignedInfo?.apiVersion,
            NSU: unsignedInfo?.NSU,
        } as MaintenanceSoldProposal)
        return proposal
    }

    async insertLuckNumber(signedInfo: any) {
        return
    }
}
