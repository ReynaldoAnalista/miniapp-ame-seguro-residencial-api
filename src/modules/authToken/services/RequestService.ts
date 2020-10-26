import axios from "axios";
import {inject, injectable} from "inversify";
import {TYPES} from "../../../inversify/inversify.types";
import {ParameterStore} from "../../../configs/ParameterStore";
import {AuthTokenService} from "./AuthTokenService";
import {getLogger} from "../../../server/Logger";

const log = getLogger("AuthTokenService")

@injectable()
export class RequestService {

    constructor(
        @inject(TYPES.ParameterStore)
        private parameterStore: ParameterStore,
        @inject(TYPES.AuthTokenService)
        private authTokenService: AuthTokenService
    ) {
    }

    async webRequestCreatePrice(path: string, long: string, lat: string, tokenAccess: string | undefined) {

        log.debug("RequestService: webRequestCreatePrice")

        let config = {
            headers: {
                "Content-Type":"application/json",
                "client_id":  await this.authTokenService.retrieveClientId(),
                "access_token": tokenAccess
            }
        }
        const url = await this.parameterStore.getSecretValue('URL');

        let result = await axios.get(`${url}${path}longitude=${long}&latitude=${lat}`,config)
            
        return result.data;
    }

    async webRequestCreateTransactions(path: string, ddd: string, phone:string, tokenAccess: string | undefined) {

        log.debug("RequestService: webRequestCreateTransactions")

        let config = {
            headers: {
                "Content-Type":"application/json",
                "client_id":  await this.authTokenService.retrieveClientId(),
                "access_token": tokenAccess
            }
        }
        const url = await this.parameterStore.getSecretValue('URL');

        let result = await axios.get(`${url}${path}consumer-phone-ddd=${ddd}&consumer-phone=${phone}`,config)

        return result.data;
    }

    async webRequestCreatePayment(body: object, tokenAccess: string | undefined) {

        log.debug("RequestService: webRequestCreatePayment")

        let config = {
            headers: {
                "Content-Type":"application/json",
                "client_id":  await this.authTokenService.retrieveClientId(),
                "access_token": tokenAccess
            }
        }

        const url = await this.parameterStore.getSecretValue('URL');

        let result = await axios.post(`${url}vouchers`, body, config)
        
        return result.data;
    }

    async webRequestCreateVouchers(code: string, tokenAccess: string | undefined) {

        log.debug("RequestService: webRequestCreateVouchers")

        let config = {
            headers: {
                "Content-Type":"application/json",
                "client_id":  await this.authTokenService.retrieveClientId(),
                "access_token": tokenAccess
            }
        }

        const url = await this.parameterStore.getSecretValue('URL');
        
        let result = await axios.get(`${url}vouchers?code=${code}`, config)

        return result.data;
    }


    async webRequestCancelVoucher(path: string,  voucherCode: string, tokenAccess: string | undefined) {

        log.debug("RequestService: webRequestCancelVoucher")

        let config = {
            headers: {
                "Content-Type":"application/json",
                "client_id":  await this.authTokenService.retrieveClientId(),
                "access_token": tokenAccess
            }
        }
        const url = await this.parameterStore.getSecretValue('URL');

        let result = await axios.delete(`${url}${path}${voucherCode}`,config)

        return result.data;
    }
}