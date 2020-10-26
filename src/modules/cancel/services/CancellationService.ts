import {inject, injectable} from "inversify";
import {getLogger} from "../../../server/Logger";
import {TYPES} from "../../../inversify/inversify.types";
import {AuthTokenService} from "../../authToken/services/AuthTokenService";
import {AuthToken} from "../../authToken/model/AuthToken";
import {ParameterStore} from "../../../configs/ParameterStore";
import {RequestService} from "../../authToken/services/RequestService";
import {Cancel} from "../model/Cancel";

const log = getLogger("CancellationService")

@injectable()
export class CancellationService {

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
     * Serviço cancela um voucher pelo seu código
     * @param voucherCode
     */

    async cancelVoucher(voucherCode: string) {

        log.debug("CancellationService: cancelVoucher");

        try{
            const token = await this.authTokenService.retrieveAuthorization();

            let aux:Cancel[] =  await this.requestService.webRequestCancelVoucher('vouchers/', voucherCode, token)

        }catch(err){

            console.log('Ocorreu um erro ao cancelar o vale');
            return [];
        }
    }
}
