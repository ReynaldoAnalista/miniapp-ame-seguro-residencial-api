import { inject, injectable } from "inversify";
import { getLogger } from "../../../server/Logger";
import { TYPES } from "../../../inversify/inversify.types";
import { AuthTokenService } from "../../authToken/services/AuthTokenService";
import { RequestService } from "../../authToken/services/RequestService";
import { ParameterStore } from "../../../configs/ParameterStore";
import { SmartphoneSoldProposal } from "../../smartphoneProposal/model/SmartphoneSoldProposal";
import { Tenants } from "../../default/model/Tenants";

const log = getLogger("PetProposalService");

@injectable()
export class PetProposalService {

    constructor(
        @inject("RequestService") private requestService : RequestService
    ) {

    }

    async listPlans() {
        let result
        try {
            const response = await this.requestService.makeRequest(
                this.requestService.ENDPOINTS.PET_URL_BASE,
                this.requestService.METHODS.POST,
                null,
                'PET',
                'grant_type=client_credentials&scope=seguro-pet'
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

}
