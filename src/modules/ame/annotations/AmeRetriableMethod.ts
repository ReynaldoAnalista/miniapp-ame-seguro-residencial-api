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
                    log.debug("Decodificacao do token para logar", decodedToken)
                    if (now > decodedToken.exp * 1000) {
                        input.token = await amePaymentService.login()
                        log.debug("Recebimento do token de login (1)", input.token)
                        return await method.apply(this, arguments)
                    } else {
                        input.token = token
                        log.debug("Recebimento do token de login (2)", input.token)
                        return await method.apply(this, arguments)
                    }
                } else {
                    input.token = await amePaymentService.login()
                    log.debug("Recebimento do token de login (3)", input.token)
                    return await method.apply(this, arguments)
                }
            } catch (e: any) {
                try {
                    input.token = await amePaymentService.login()
                    log.debug("Recebimento do token de login (4)", input.token)
                    return await method.apply(this, arguments)
                } catch (e2) {
                    log.error("Erro no envio do token de login", e2)
                    throw e2
                }
            }
        }
    }
}
