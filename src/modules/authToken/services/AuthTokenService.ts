import { inject, injectable } from "inversify"
import { getLogger } from "../../../server/Logger"
import { TYPES } from "../../../inversify/inversify.types"
import { ParameterStore } from "../../../configs/ParameterStore"
import axios from "axios"
import qs from "qs"
import * as jwt from "jsonwebtoken"

import { AuthToken } from "../model/AuthToken"
import { Tenants } from "../../default/model/Tenants"

const cache = require("memory-cache")
const AWS = require("aws-sdk")
const log = getLogger("AuthTokenService")

AWS.config.update({
    region: "us-east-1",
})

@injectable()
export class AuthTokenService {
    constructor(@inject(TYPES.ParameterStore) private parameterStore: ParameterStore) {}

    private async retrieveConfig(configName: string): Promise<string> {
        log.debug(`Searching for config: ${configName}`)
        if (configName) {
            try {
                const configValue = await this.parameterStore.getSecretValue(configName)
                if (!configValue) {
                    log.debug("There is no value to this config")
                }
                log.debug(`Success for config: ${configName}`)
                return configValue
            } catch (err) {
                log.error("Take error on trying to retrieve config")
                throw err
            }
        }
        log.error("Retrieving config with no configName")
        throw "Retrieving config with no configName"
    }

    async getUrlBase(tenant: string) {
        switch (tenant) {
            case "SMARTPHONE":
                return "SMARTPHONE_URL_AUTHORIZATION"
            case "PET":
                return "PET_URL_BASE"
            case "LIFE":
                return "LIFE_URL_AUTHORIZATION"
            case "HEALTHCARE":
                return "HEALTHCARE_URL_AUTHORIZATION"
            case "RENEW_PORTABLE":
                return "RENEW_PORTABLE_URL_AUTHORIZATION"
            case "RENEW_PORTABLE_DIGIBEE":
                return "RENEW_PORTABLE_DIGIBE_AUTHORIZATION"
            default:
                return "URL_AUTHORIZATION"
        }
    }

    async retrieveAuthorization(tenant: string, resetCache = false): Promise<string | undefined> {
        log.debug("Starting Authorization for " + tenant)
        const AUTH_KEY = await this.getUrlBase(tenant)
        const AUTH_URL = await this.parameterStore.getSecretValue(AUTH_KEY)
        const TOKEN_CACHE = `TOKENCACHE_${tenant}`
        if (resetCache) {
            log.debug("Clearing Token from cache")
            cache.del(TOKEN_CACHE)
        }
        if (cache.get(TOKEN_CACHE)) {
            log.debug("Authorization Token by Cache")
            return cache.get(TOKEN_CACHE)
        }
        log.debug("Authorization Token expired, requesting another one.")
        try {
            if (tenant === Tenants.RESIDENTIAL) {
                log.debug("Trying to authorizate on " + AUTH_URL)
                const clientId = await this.retrieveConfig("CLIENT_ID")
                const clientSecret = await this.retrieveConfig("CLIENT_SECRET")
                const clientScope = await this.retrieveConfig("CLIENT_SCOPE")
                const authorization = Buffer.from(`${clientId}:${clientSecret}`, "utf8").toString("base64")
                const config = {
                    headers: {
                        Authorization: `Basic ${authorization}`,
                        "Content-Type": "application/x-www-form-urlencoded",
                        "User-Agent": "",
                    },
                }
                const body = qs.stringify({
                    grant_type: "client_credentials",
                    scope: clientScope,
                })
                let result: AuthToken = new AuthToken()

                await axios
                    .post(AUTH_URL, body, config)
                    .then((res) => {
                        log.debug("AUTHORIZED")
                        result = AuthToken.fromObject(res.data)
                    })
                    .catch((err) => {
                        log.error("ERROR ON AUTHORIZING")
                        log.error("AXIOS ERROR: ", err)
                    })

                cache.put(TOKEN_CACHE, result.access_token, 1000 * 60 * 60 * 20)
                return result.access_token
            }

            if (tenant === Tenants.SMARTPHONE) {
                log.debug("Trying to authorizate on " + AUTH_URL)
                const API_KEY = await this.parameterStore.getSecretValue("SMARTPHONE_API_KEY")
                const config = {
                    headers: {
                        apikey: API_KEY,
                        "Accept-Encoding": "gzip, deflate, br",
                        Accept: "*/*",
                        Connection: "keep-alive",
                        "User-Agent": "",
                    },
                }
                log.debug("Trying to authorizate")
                let result
                await axios
                    .get(AUTH_URL, config)
                    .then((res) => {
                        log.debug("AUTHORIZED")
                        result = res.headers["authorization"]
                    })
                    .catch((err) => {
                        log.error("ERROR ON AUTHORIZING")
                        log.error("AXIOS ERROR: ", err)
                    })
                cache.put(TOKEN_CACHE, result, 1000 * 60)
                return result
            }
            if (tenant === Tenants.PET) {
                log.debug(
                    "Trying to authorizate on " + AUTH_URL + "auth/oauth/token?grant_type=client_credentials&scope=seguro-pet"
                )
                const clientId = await this.retrieveConfig("PET_CLIENT_ID")
                const clientSecret = await this.retrieveConfig("PET_CLIENT_SECRET")
                const clientScope = await this.retrieveConfig("PET_CLIENT_SCOPE")
                const authorization = Buffer.from(`${clientId}:${clientSecret}`, "utf8").toString("base64")
                const config = {
                    headers: {
                        Authorization: `Basic ${authorization}`,
                        "Content-Type": "application/x-www-form-urlencoded",
                        "User-Agent": "",
                    },
                }
                const body = qs.stringify({
                    grant_type: "client_credentials",
                    scope: clientScope,
                })
                let result: AuthToken = new AuthToken()

                await axios
                    .post(AUTH_URL + "auth/oauth/token?grant_type=client_credentials&scope=seguro-pet", body, config)
                    .then((res) => {
                        log.debug("AUTHORIZED")
                        result = AuthToken.fromObject(res.data)
                    })
                    .catch((err) => {
                        log.error("ERROR ON AUTHORIZING")
                        log.error("AXIOS ERROR: ", err)
                    })

                cache.put(TOKEN_CACHE, result.access_token, 1000 * 60 * 60 * 20)
                return result.access_token
            }

            if (tenant === Tenants.LIFE) {
                log.debug("Trying to authorizate on " + AUTH_URL)
                const lifeKey = await this.retrieveConfig("LIFE_API_AUTH_KEY")
                const config = {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        apikey: lifeKey,
                    },
                }
                let result

                await axios
                    .get(AUTH_URL, config)
                    .then((res) => {
                        log.debug("AUTHORIZED")
                        result = res.headers
                    })
                    .catch((err) => {
                        log.error("ERROR ON AUTHORIZING")
                        log.error("AXIOS ERROR: ", err)
                    })
                // cache.put(TOKEN_CACHE, result.access_token, 1000 * 60 * 60 * 20)
                return result.authorization
            }

            if (tenant === Tenants.HEALTHCARE) {
                log.debug("Trying to authorizate on " + AUTH_URL)
                const clientId = await this.retrieveConfig("HEALTHCARE_CLIENT_ID")
                const clientSecret = await this.retrieveConfig("HEALTHCARE_CLIENT_SECRET")
                const clientScope = await this.retrieveConfig("HEALTHCARE_CLIENT_SCOPE")
                const authorization = Buffer.from(`${clientId}:${clientSecret}`, "utf8").toString("base64")

                const config = {
                    headers: {
                        Authorization: `Basic ${authorization}`,
                        "Content-Type": "application/x-www-form-urlencoded",
                        "User-Agent": "",
                    },
                }
                const body = qs.stringify({
                    grant_type: "client_credentials",
                    scope: clientScope,
                })
                let result: AuthToken = new AuthToken()

                await axios
                    .post(AUTH_URL, body, config)
                    .then((res) => {
                        log.debug("AUTHORIZED")
                        result = AuthToken.fromObject(res.data)
                    })
                    .catch((err) => {
                        log.error("ERROR ON AUTHORIZING")
                        log.error("AXIOS ERROR: ", err)
                    })

                cache.put(TOKEN_CACHE, result.access_token, 1000 * 60 * 60 * 20)
                return result.access_token
            }

            if (tenant === Tenants.RENEW_PORTABLE) {
                log.debug("Trying to authorizate on " + AUTH_URL)
                const clientId = await this.retrieveConfig("RENEW_PORTABLE_CLIENT_ID")
                const clientSecret = await this.retrieveConfig("RENEW_PORTABLE_CLIENT_SECRET")
                const clientScope = await this.retrieveConfig("RENEW_PORTABLE_SCOPE")
                const authorization = Buffer.from(`${clientId}:${clientSecret}`, "utf8").toString("base64")
                const config = {
                    headers: {
                        Authorization: `Basic ${authorization}`,
                        "Content-Type": "application/x-www-form-urlencoded",
                        "User-Agent": "",
                    },
                }
                const body = qs.stringify({
                    grant_type: "client_credentials",
                    scope: clientScope,
                })
                let result: AuthToken = new AuthToken()

                await axios
                    .post(AUTH_URL, body, config)
                    .then((res) => {
                        log.debug("AUTHORIZED")
                        result = AuthToken.fromObject(res.data)
                    })
                    .catch((err) => {
                        log.error("ERROR ON AUTHORIZING")
                        log.error("AXIOS ERROR: ", err)
                    })

                cache.put(TOKEN_CACHE, result.access_token, 1000 * 60 * 60 * 20)
                return result.access_token
            }

            if (tenant === Tenants.RENEW_PORTABLE_DIGIBEE) {
                log.debug("Trying to authorizate on " + AUTH_URL)
                const API_KEY = await this.parameterStore.getSecretValue("RENEW_PORTABLE_API_KEY")
                const config = {
                    headers: {
                        apikey: API_KEY,
                        "Accept-Encoding": "gzip, deflate, br",
                        Accept: "*/*",
                        Connection: "keep-alive",
                        "User-Agent": "",
                    },
                }
                log.debug("Trying to authorizate")
                let result
                await axios
                    .get(AUTH_URL, config)
                    .then((res) => {
                        log.debug("AUTHORIZED")
                        result = res.headers["authorization"]
                    })
                    .catch((err) => {
                        log.error("ERROR ON AUTHORIZING")
                        log.error("AXIOS ERROR: ", err)
                    })
                cache.put(TOKEN_CACHE, result, 1000 * 60)
                return result
            }
        } catch (err) {
            return "Erro ao tentar buscar um token para autentica????o"
        }
    }

    async unsignNotification(signedPayment: string): Promise<any> {
        const secret = await this.parameterStore.getSecretValue("CALINDRA_JWT_SECRET")
        return new Promise((resolve, reject) => {
            jwt.verify(signedPayment, secret, function (err: any, decoded: any) {
                if (err) {
                    reject(new Error(`Signed payment: ${err.message}`))
                } else {
                    resolve(decoded)
                }
            })
        })
    }
}
