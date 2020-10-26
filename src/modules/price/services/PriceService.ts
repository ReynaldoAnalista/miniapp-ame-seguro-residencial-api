import {inject, injectable} from "inversify";
import {getLogger} from "../../../server/Logger";
import {TYPES} from "../../../inversify/inversify.types";
import {AuthTokenService} from "../../authToken/services/AuthTokenService";
import {AuthToken} from "../../authToken/model/AuthToken";
import {ParameterStore} from "../../../configs/ParameterStore";
import {RequestService} from "../../authToken/services/RequestService";
import {Price} from "../model/Price";

const log = getLogger("PriceService")

@injectable()
export class PriceService {

    constructor(
        @inject("AuthTokenService")
        private authTokenService: AuthTokenService,
        @inject("RequestService")
        private requestService: RequestService,
        @inject(TYPES.ParameterStore)
        private parameterStore: ParameterStore
    ) {
    }

    /**
     * Serviço retorna uma lista de preços por latitude e longitude
     * @param coords
     */

    async retrievePrices(long: string, lat: string) {

        log.debug("PriceService: retrievePrices");

        try{
            const token = await this.authTokenService.retrieveAuthorization();

            let result: Price[] =  await this.requestService.webRequestCreatePrice('prices?', long, lat, token)

            return result
        }catch(err){
            console.log('Ocorreu um erro ao tentar buscar os preços.');
            return [];
        }
    }
}
