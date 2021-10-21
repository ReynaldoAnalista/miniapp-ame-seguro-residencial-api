import { inject, injectable } from "inversify"
import { getLogger } from "../../../server/Logger"
import { SmartphoneProposalRepository } from "../../smartphoneProposal/repository/SmartphoneProposalRepository"
import { SmartphoneProposalMailService } from "../../smartphoneProposal/services/SmartphoneProposalMailService"
import { AuthTokenService } from "../../authToken/services/AuthTokenService"
import { UnusualRepository } from "../repository/UnusualRepository"
import { UnusualSoldProposal } from "../model/UnusualSoldProposal"

const log = getLogger("UnusualService")

@injectable()
export class UnusualService {
    constructor(
        @inject("SmartphoneProposalRepository")
        private smartphoneProposalRepository: SmartphoneProposalRepository,
        @inject("SmartphoneProposalMailService")
        private smartphoneProposalMailService: SmartphoneProposalMailService,
        @inject("AuthTokenService")
        private authTokenService: AuthTokenService,
        @inject("UnusualRepository")
        private unusualRepository: UnusualRepository
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
}
