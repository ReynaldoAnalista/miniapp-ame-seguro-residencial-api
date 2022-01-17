import axios from "axios"
import { inject, injectable } from "inversify"
import { TYPES } from "../../../inversify/inversify.types"
import { ParameterStore } from "../../../configs/ParameterStore"
import { AuthTokenService } from "./AuthTokenService"
import { getLogger } from "../../../server/Logger"
import { Tenants } from "../../default/model/Tenants"

const log = getLogger("RequestService")

enum Methods {
    GET = "GET",
    POST = "POST",
    DELETE = "DELETE",
    PUT = "PUT",
}

enum Endpoints {
    RESIDENTIAL_URL_PLANS = "URL_PLANS",
    RESIDENTIAL_URL_ZIPCODE = "URL_ZIPCODE",
    RESIDENTIAL_URL_AUTHORIZATION = "URL_AUTHORIZATION",
    RESIDENTIAL_URL_SALE = "URL_SALE",
    SMARTPHONE_URL_AUTHORIZATION = "SMARTPHONE_URL_AUTHORIZATION",
    SMARTPHONE_URL_SALE = "SMARTPHONE_URL_SALE",
    RENEW_PORTABLE_URL_SALE = "RENEW_PORTABLE_URL_SALE",
    SMARTPHONE_URL_CANCEL = "SMARTPHONE_URL_CANCEL",
    PET_URL_BASE = "PET_URL_BASE",
    LIFE_URL_BASE = "LIFE_URL_BASE",
    HEALTHCARE_URL_BASE = "HEALTHCARE_URL_BASE",
    RENEW_PORTABLE_URL_BASE = "RENEW_PORTABLE_URL_BASE",
    FAQ = "FAQ",
}

@injectable()
export class RequestService {
    constructor(
        @inject(TYPES.ParameterStore)
        private parameterStore: ParameterStore,
        @inject(TYPES.AuthTokenService)
        private authTokenService: AuthTokenService
    ) {}

    METHODS = Methods
    ENDPOINTS = Endpoints

    async makeRequest(url: Endpoints, method: Methods, body: any, tenant: string, queryString?: string) {
        log.debug(`Call to make a ${method} on ${url}`)
        const apiUrl = await this.parameterStore.getSecretValue(url)
        const token = await this.authTokenService.retrieveAuthorization(tenant)

        log.debug(`Making ${method} to ${apiUrl}`)

        let headers
        if (tenant === Tenants.SMARTPHONE) {
            headers = {
                "Content-Type": "application/json",
                Authorization: token,
                apikey: await this.parameterStore.getSecretValue("SMARTPHONE_API_KEY"),
            }
        }
        if (tenant === Tenants.RESIDENTIAL) {
            headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        }
        if (tenant === Tenants.PET) {
            headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        }
        if (tenant === Tenants.LIFE) {
            headers = {
                "Content-Type": "application/json",
                apikey: await this.parameterStore.getSecretValue("LIFE_API_AUTH_KEY"),
                Authorization: `${token}`,
            }
        }
        if (tenant === Tenants.HEALTHCARE) {
            headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        }
        if (tenant === Tenants.RENEW_PORTABLE) {
            headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        }
        if (tenant === Tenants.RENEW_PORTABLE_DIGIBEE) {
            headers = {
                "Content-Type": "application/json",
                Authorization: token,
                apikey: await this.parameterStore.getSecretValue("RENEW_PORTABLE_API_KEY"),
            }
        }

        const config = {
            method: method,
            url: apiUrl + (queryString ? queryString : ""),
            headers,
            data: body != null ? JSON.stringify(body) : null,
        }

        const result = await axios(config)

        log.debug("Request Successfully")
        if (result.headers && result.headers["x-b3-traceid"]) {
            log.debug(`Trace ID: ${result.headers["x-b3-traceid"]}`)
        }

        return result
    }
}
