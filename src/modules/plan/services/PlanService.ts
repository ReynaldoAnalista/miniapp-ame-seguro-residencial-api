import {inject, injectable} from "inversify";
import {getLogger} from "../../../server/Logger";
import {TYPES} from "../../../inversify/inversify.types";
import {AuthTokenService} from "../../authToken/services/AuthTokenService";
import {AuthToken} from "../../authToken/model/AuthToken";
import {RequestService} from "../../authToken/services/RequestService";
import {Plan} from "../model/Plan";

const log = getLogger("PlanService")

@injectable()
export class PlanService {

    constructor(
        @inject("AuthTokenService")
        private authTokenService: AuthTokenService,
        @inject("RequestService")
        private requestService: RequestService,
    ) {
    }

    async retrievePlanList(
        contract: string,
        occupation: string,
        property: string,
        construction: string,
        zipCode: string,
        commission: string
    ) {
        log.debug("retrievePlanList");
        try {
            let result: Plan[] = await this.requestService.makeRequest(
                this.requestService.ENDPOINTS.URL_PLANS,
                this.requestService.METHODS.GET,
                null,
                `?contrato=${contract}&ocupacao=${occupation}&imovel=${property}&construcao=${construction}&cep=${zipCode}&comissao=${commission}`
            )
            return result
        } catch (err) {
            console.log('Ocorreu um erro ao tentar buscar os preços.');
            return [];
        }
    }
}
