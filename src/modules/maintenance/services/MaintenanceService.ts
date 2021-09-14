import { inject, injectable } from "inversify"
import { getLogger } from "../../../server/Logger"
import { AuthTokenService } from "../../authToken/services/AuthTokenService"
import { SmartphoneProposalRepository } from "../../smartphoneProposal/repository/SmartphoneProposalRepository"
import { SmartphoneProposalMailService } from "../../smartphoneProposal/services/SmartphoneProposalMailService"
import { MaintenanceRepository } from "../repository/MaintenanceRepository"

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
        } catch (e: any) {
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
}
