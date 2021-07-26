import { inject, injectable } from "inversify"
import { getLogger } from "../../../server/Logger"
import { SmartphoneProposalRepository } from "../../smartphoneProposal/repository/SmartphoneProposalRepository"
import { SmartphoneProposalMailService } from "../../smartphoneProposal/services/SmartphoneProposalMailService"
import { UnusualRepository } from "../repository/UnusualRepository"

const log = getLogger("UnusualService")

@injectable()
export class UnusualService {
    constructor(
        @inject("SmartphoneProposalRepository")
        private smartphoneProposalRepository: SmartphoneProposalRepository,
        @inject("SmartphoneProposalMailService")
        private smartphoneProposalMailService: SmartphoneProposalMailService,
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

    async setPlanActiveCanceled(proposal: any) {
        let numberOfSuccess = 0
        try {
            proposal.map(async (item) => {
                const updateProposal = await this.updateSoldProposalActive(item)
                if (updateProposal) {
                    numberOfSuccess = numberOfSuccess + 1
                }
            })
        } catch (e) {
            log.error("Erro no cadastro", e.message)
        }
        return `Orders Updated: ${numberOfSuccess}`
    }

    async updateSoldProposalActive(proposal) {
        return await this.unusualRepository.updateSoldProposal(proposal)
    }
}
