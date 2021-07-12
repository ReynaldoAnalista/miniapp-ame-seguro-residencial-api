import "reflect-metadata"
import * as express from "express"
import * as jwt from "jsonwebtoken"
import { iocContainer } from "../inversify/inversify.config"
import { ApiError } from "../errors/ApiError"
import { ParameterStore } from "../configs/ParameterStore"

export async function expressAuthentication(request: express.Request, securityName: string, scopes: string[] = []): Promise<any> {
    if (securityName === "api_key") {
        const apiKey = request.headers["x-api-key"]
        if (!process.env.SAC_API_KEY || process.env.SAC_API_KEY !== apiKey) {
            return Promise.reject(new ApiError("ApiForbidden", 401, "wrong api key"))
        }
        return Promise.resolve({ email: "sac@amedigital.com" })
    } else if (securityName === "jwt") {
        const token = request.headers.authorization?.replace(/^Bearer /, "")
        const parameterStore: ParameterStore = iocContainer.get("ParameterStore")
        const secret = await parameterStore.getSecretValue("CALINDRA_JWT_SECRET")
        if (!secret) {
            console.log("CALINDRA_JWT_SECRET precisa ser definida")
            process.exit(1)
        }
        return new Promise((resolve, reject) => {
            if (!token) {
                reject(new ApiError("ApiForbidden", 401, "JWT missing."))
            }
            jwt.verify(token, secret, function (err: any, decoded: any) {
                if (err) {
                    reject(err)
                } else {
                    // Check if JWT contains all required scopes
                    for (let scope of scopes) {
                        if (!decoded.scopes.includes(scope)) {
                            reject(new ApiError("ApiForbidden", 403, "JWT does not contain required scope."))
                        }
                    }
                    resolve(decoded)
                }
            })
        })
    } else {
        return Promise.resolve()
    }
}
