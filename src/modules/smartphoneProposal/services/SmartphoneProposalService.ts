import {inject, injectable} from "inversify";
import {getLogger} from "../../../server/Logger";
import {TYPES} from "../../../inversify/inversify.types";
import {AuthTokenService} from "../../authToken/services/AuthTokenService";
import {RequestService} from "../../authToken/services/RequestService";
import {SmartphoneProposalRepository} from "../repository/SmartphoneProposalRepository";
import {SmartphoneProposalResponseRepository} from "../repository/SmartphoneProposalResponseRepository";
import {ParameterStore} from "../../../configs/ParameterStore";
import {SmartphoneSoldProposal} from "../model/SmartphoneSoldProposal";
import {SmartphoneSoldProposalRepository} from "../repository/SmartphoneSoldProposalRepository";
import {Tenants} from "../../default/model/Tenants";

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
        @inject(TYPES.ParameterStore)
        private parameterStore: ParameterStore
    ) {
    }

    async saveProposal(proposal: any): Promise<void> {
        log.debug('Saving proposal to DynamoDB')
        try {
            await this.smartphoneProposalRepository.create(proposal)
        } catch (e) {
            log.error(e)
            throw "Erro ao criar registro no Dynamo DB"
        }
    }

    async sendProposal(proposal: any) {
        log.debug('Sending proposal to Partner')
        let result
        try {
            const response = await this.requestService.makeRequest(
                this.requestService.ENDPOINTS.SMARTPHONE_URL_SALE,
                this.requestService.METHODS.POST,
                proposal,
                Tenants.SMARTPHONE
            );
            result = {success: true, content: response.data}
            log.info('Success proposal sent')
        } catch (e) {
            const status = e.response?.status
            const statusText = e.response?.statusText
            result = {success: false, status: status, message: statusText}
            log.error(`Error %j`, statusText)
            log.debug('Error when trying to send proposal');
            log.debug(`Status Code: ${status}`)
        }

        return result
    }

    async saveProposalResponse(proposal: any,) {
        log.debug("saveProposalResponse")
        try {
            await this.responseRepository.create(this.processProposalResponse(proposal))
            log.debug("saveProposalResponse:success")
        } catch (e) {
            log.debug("saveProposalResponse:Fail")
            log.debug(e.message)
        }
    }

    async saveSoldProposal(proposal: any, response: any, tenant: string) {
        log.debug("saveSoldProposal")
        this.smartphoneSoldProposalRepository.create({
            customerId: proposal.attributes.customPayload.customerId,
            order: proposal.id,
            tenant: tenant,
            createdAt: new Date().toISOString(),
            success: response.success,
            partnerResponse: response,
            receivedPaymentNotification: proposal
        } as SmartphoneSoldProposal)
    }

    processProposalResponse(proposal: any): any {
        if (proposal.body?.id) {
            proposal.id = proposal.body.id
            return proposal
        } else {
            throw "Proposal response have not an ID"
        }
    }
}
