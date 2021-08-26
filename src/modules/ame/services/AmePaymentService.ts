import "reflect-metadata"
import { injectable, inject } from "inversify"
import Axios from "axios"
import { ParameterStore } from "../../../configs/ParameterStore"
import { getLogger } from "../../../server/Logger"
import { ApiError } from "../../../errors/ApiError"
import { AmeApiConfig } from "../../../configs/AmeApiConfig"
import { AmeRetriableMethod } from "../annotations/AmeRetriableMethod"
import { AmeApiInput } from "../model/AmeApiInput"
import { AmeApiRefundInput } from "../model/AmeApiRefundInput"
const logger = getLogger("AmePaymentService")

@injectable()
export class AmePaymentService {
    _config: any
    tokenCode = ""

    constructor(
        @inject("ParameterStore")
        private parameterStore: ParameterStore,
        @inject("AmeApiConfig")
        private ameApiConfig: AmeApiConfig
    ) {}

    private async getConfig() {
        return (this._config = {
            client_id: await this.parameterStore.getSecretValue("BLIND_GUARDIAN_CLIENT_ID"),
            client_secret: await this.parameterStore.getSecretValue("BLIND_GUARDIAN_CLIENT_SECRET"),
            blindGuardianUrl: await this.parameterStore.getSecretValue("BLIND_GUARDIAN_URL"),
            paymentApi: await this.parameterStore.getSecretValue("BLIND_GUARDIAN_API"),
        })
    }

    async login() {
        const cfg = await this.getConfig()

        const loginParams = {
            client_id: cfg.client_id,
            client_secret: cfg.client_secret,
            grant_type: "client_credentials",
        }
        try {
            const resAmeAuth = await Axios.post(`${cfg.blindGuardianUrl}/o/auth`, loginParams)
            this.tokenCode = resAmeAuth.data.accessToken

            return this.tokenCode
        } catch (e) {
            logger.error(e.message)
            throw new ApiError("error.login.blindguardian", 500)
        }
    }

    @AmeRetriableMethod()
    async captureAuthorization(input: AmeApiInput) {
        logger.debug("Iniciando captura payment id ", input.paymentId)
        const cfg = await this.getConfig()

        const axiosOptions = {
            headers: {
                Authorization: `Bearer ${input.token}`,
            },
        }

        const params = {
            publicKey: input.walletToken,
        }

        try {
            await Axios.put(`${cfg.paymentApi}/p/payment/authorize/${input.paymentId}/capture`, params, axiosOptions)
            logger.debug("Captura de pagamento efetuado com sucesso. Payment id ", input.paymentId)
        } catch (e) {
            logger.error("Erro ao capturar pagamento. Payment id ", input.paymentId)
            throw new ApiError("error.capture.payment", 500)
        }
    }

    @AmeRetriableMethod()
    async refund(input: AmeApiRefundInput) {
        logger.debug("Iniciando estorno payment id ", input.paymentId)

        const cfg = await this.getConfig()

        const axiosOptions = {
            headers: {
                Authorization: `Bearer ${input.token}`,
            },
        }

        const params = {
            amount: input.amount,
            origin: input.paymentId,
            walletToken: input.walletToken,
        }

        try {
            await Axios.put(`${cfg.paymentApi}/p/payments/${input.paymentId}/refund`, params, axiosOptions)
            logger.debug("Estorno de pagamento efetuado com sucesso. Payment id ", input.paymentId)
        } catch (e) {
            logger.error("Erro ao estornar pagamento. Payment id ", input.paymentId)
            throw new ApiError("error.refund.payment", 500)
        }
    }

    @AmeRetriableMethod()
    async cancelPayment(input: AmeApiInput) {
        logger.debug("Iniciando cancelamento payment id ", input.paymentId)

        const cfg = await this.getConfig()

        const axiosOptions = {
            headers: {
                Authorization: `Bearer ${input.token}`,
            },
        }

        const params = {
            publicKey: input.walletToken,
        }

        try {
            await Axios.put(`${cfg.paymentApi}/p/payment/authorize/${input.paymentId}/cancel`, params, axiosOptions)
            logger.debug("Cancelamento de pagamento efetuado com sucesso. Payment id ", input.paymentId)
        } catch (e) {
            logger.error("Erro ao cancelar pagamento. Payment id ", input.paymentId, e)
            throw new ApiError("error.cancel.payment", 500)
        }
    }

    @AmeRetriableMethod()
    async getPayment(input: AmeApiInput) {
        logger.debug("Buscando pagamento ", input.paymentId)

        const cfg = await this.getConfig()

        const axiosOptions = {
            headers: {
                Authorization: `Bearer ${input.token}`,
            },
        }

        try {
            const result = await Axios.get(`${cfg.paymentApi}/p/payments/${input.walletToken}/${input.paymentId}`, axiosOptions)
            logger.debug("Pagamento obtido com sucesso ", input.paymentId)
            return result.data
        } catch (e) {
            logger.error("Erro ao buscar pagamento. Payment id ", input.paymentId, e)
            throw new ApiError("error.get.payment", 500)
        }
    }
}
