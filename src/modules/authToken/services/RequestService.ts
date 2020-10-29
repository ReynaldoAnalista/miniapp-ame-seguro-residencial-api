import axios from "axios";
import {inject, injectable} from "inversify";
import {TYPES} from "../../../inversify/inversify.types";
import {ParameterStore} from "../../../configs/ParameterStore";
import {AuthTokenService} from "./AuthTokenService";
import {getLogger} from "../../../server/Logger";
import {End} from "aws-sdk/clients/s3";

const log = getLogger("RequestService")

enum Methods {
    GET = "GET",
    POST = "POST",
    DELETE = "DELETE",
    PUT = "PUT",
}

enum Endpoints {
    URL_PLANS = 'URL_PLANS',
    URL_AUTHORIZATION = 'URL_AUTHORIZATION',
    URL_SALE = 'URL_SALE',
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

    async makeRequest(url:Endpoints, method:Methods, body: object | null, queryString?: string ) {

        log.debug(`Call to make a ${method} on ${url}`)

        const apiUrl = await this.parameterStore.getSecretValue(url)
        const token = await this.authTokenService.retrieveAuthorization()

        log.debug(`Making ${method} to ${apiUrl}`)

        let config = {
            method: method,
            url: apiUrl + queryString,
            headers: {
                "Content-Type":"application/json",
                "Authorization": `Bearer ${token}`
            },
            data: JSON.stringify(body)
        }

        let result = await axios(config)

        log.debug("Request Successfully")

        return result.data;
    }
}
