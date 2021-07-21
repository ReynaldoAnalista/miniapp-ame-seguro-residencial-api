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
}
