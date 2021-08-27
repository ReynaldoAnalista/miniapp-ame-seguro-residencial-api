import { getLogger } from "../../../server/Logger"
import { AmePaymentService } from "../services/AmePaymentService"
import { iocContainer } from "../../../inversify/inversify.config"
import { ApiError } from "../../../errors/ApiError"
import { AmeApiInput } from "../model/AmeApiInput"

const log = getLogger("AmeRetriableMethod")

export function AmeRetriableMethod(options: any = {}) {
    return function (target: any, propertyName: string, descriptor: any) {
        const method = descriptor.value
        descriptor.value = async function (input: AmeApiInput) {
            const amePaymentService: AmePaymentService = iocContainer.get("AmePaymentService")
            try {
                const token = amePaymentService.tokenCode
                if (token) {
                    const jwtDecode = require("jwt-decode")
                    const decodedToken = jwtDecode(token)
                    const now = new Date().getTime()

                    if (now > decodedToken.exp * 1000) {
                        input.token = await amePaymentService.login()
                        return await method.apply(this, arguments)
                    } else {
                        input.token = token
                        return await method.apply(this, arguments)
                    }
                } else {
                    input.token = await amePaymentService.login()
                    return await method.apply(this, arguments)
                }
            } catch (e) {
                try {
                    input.token = await amePaymentService.login()
                    return await method.apply(this, arguments)
                } catch (e2) {
                    log.error("errorOnRetry", e2)
                    throw e2
                }
            }
        }
    }
}
