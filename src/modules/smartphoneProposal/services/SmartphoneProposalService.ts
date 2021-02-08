import {inject, injectable} from "inversify";
import {getLogger} from "../../../server/Logger";
import {TYPES} from "../../../inversify/inversify.types";
import {AuthTokenService} from "../../authToken/services/AuthTokenService";
import {RequestService} from "../../authToken/services/RequestService";
import {SmartphoneProposalRepository} from "../repository/SmartphoneProposalRepository";
import {SmartphoneProposalResponseRepository} from "../repository/SmartphoneProposalResponseRepository";
import {ParameterStore} from "../../../configs/ParameterStore";

const log = getLogger("SmartphoneProposalService")

@injectable()
export class SmartphoneProposalService {

    constructor(
        @inject("AuthTokenService")
        private authTokenService: AuthTokenService,
        @inject("RequestService")
        private requestService: RequestService,
        @inject("SmartphoneProposalRepository")
        private planRepository: SmartphoneProposalRepository,
        @inject("SmartphoneProposalResponseRepository")
        private responseRepository: SmartphoneProposalResponseRepository,
        @inject(TYPES.ParameterStore)
        private parameterStore: ParameterStore
    ) {
    }

    async saveProposal(proposal: any): Promise<void> {
        log.debug('Saving proposal to DynamoDB')
        try {
            await this.planRepository.create(proposal)
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
                this.requestService.ENDPOINTS.URL_SALE,
                this.requestService.METHODS.POST,
                proposal
            );
            result = response.data
            log.info('Success proposal sent')
        } catch (e) {
            const status = e.response?.status
            result = null
            log.debug(`Error %j`, e)
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

    processProposalResponse(proposal: any): any {
        if(proposal.body?.id){
            proposal.id = proposal.body.id
            return proposal
        } else {
            throw "Proposal response have not an ID"
        }
    }
}
