import axios from "axios";
import {inject, injectable} from "inversify";
import {TYPES} from "../../../inversify/inversify.types";
import {ParameterStore} from "../../../configs/ParameterStore";
import {AuthTokenService} from "./AuthTokenService";
import {getLogger} from "../../../server/Logger";
import curlirize from 'axios-curlirize'

const log = getLogger("RequestService");

if(process.env.NODE_ENV === 'homolog' || process.env.NODE_ENV === 'development'){
    curlirize(axios);
}

enum Methods {
    GET = "GET",
    POST = "POST",
    DELETE = "DELETE",
    PUT = "PUT",
}

enum Tenants {
    SMARTPHONE = "SMARTPHONE",
    RESIDENTIAL = "RESIDENTIAL"
}

enum Endpoints {
    RESIDENTIAL_URL_PLANS = 'URL_PLANS',
    RESIDENTIAL_URL_ZIPCODE = 'URL_ZIPCODE',
    RESIDENTIAL_URL_AUTHORIZATION = 'URL_AUTHORIZATION',
    RESIDENTIAL_URL_SALE = 'URL_SALE',
    SMARTPHONE_URL_AUTHORIZATION = 'SMARTPHONE_URL_AUTHORIZATION',
    SMARTPHONE_URL_SALE = 'SMARTPHONE_URL_SALE',
}

@injectable()
export class RequestService {

    constructor(
        @inject(TYPES.ParameterStore)
        private parameterStore: ParameterStore,
        @inject(TYPES.AuthTokenService)
        private authTokenService: AuthTokenService
    ) {
    }

    METHODS = Methods
    ENDPOINTS = Endpoints
    TENANTS = Tenants

    async makeRequest(url:Endpoints, method:Methods, body: object | null, tenant: string, queryString?: string ) {

        log.debug(`Call to make a ${method} on ${url}`)
        const apiUrl = await this.parameterStore.getSecretValue(url)
        const token = await this.authTokenService.retrieveAuthorization(tenant)

        log.debug(`Making ${method} to ${apiUrl}`)

        let headers
        if(tenant === 'SMARTPHONE'){
            headers = {
                "Content-Type":"application/json",
                "Authorization": token,
                "apikey": await this.parameterStore.getSecretValue('SMARTPHONE_API_KEY')
            }
        }
        if(tenant === 'RESIDENTIAL') {
            headers = {
                "Content-Type":"application/json",
                "Authorization": `Bearer ${token}`
            }
        }

        let config = {
            method: method,
            url: apiUrl + (queryString ? queryString : ''),
            headers,
            data: JSON.stringify(body)
        }

        let result = await axios(config)

        log.debug("Request Successfully")
        if(result.headers && result.headers['x-b3-traceid']){
            log.debug(`Trace ID: ${result.headers['x-b3-traceid']}`)
        }

        return result;
    }
}
