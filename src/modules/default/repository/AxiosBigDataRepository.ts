import { injectable, inject } from "inversify"
import { RequestResponse } from "../model/RequestResponse"
import Axios from "axios"
import { ParameterStore } from "../../../configs/ParameterStore"
import { AxiosRepository } from "./AxiosRepository"
import { getLogger } from "../../../server/Logger"
import { TYPES } from "../../../inversify/inversify.types"

const logger = getLogger("AxiosBigDataRepository")

@injectable()
export class AxiosBigDataRepository implements AxiosRepository {
    private _token: Token | undefined

    constructor(
        @inject(TYPES.ParameterStore)
        private parameterStore: ParameterStore
    ) {}

    async getToken(): Promise<Token> {
        const start = Date.now()
        // expira 1 hora antes
        const slipTime = 1 * 60 * 60
        const now = Math.round(new Date().getTime() / 1000)
        const expires = this._token?.expires || 0
        if (now + slipTime < expires && this._token) {
            return this._token
        }
        const url = await this.parameterStore.getSecretValue("BIGDATA_URL")
        const saName = await this.parameterStore.getSecretValue("BIGDATA_USERNAME")
        const saKey = await this.parameterStore.getSecretValue("BIGDATA_PASSWORD")
        this._token = this.createSharedAccessToken(url, saName, saKey)
        const time = Date.now() - start
        logger.info({ message: `Tempo para gerar token ${time}ms`, timeMs: time })
        return this._token
    }

    createSharedAccessToken(uri, saName, saKey) {
        const utf8 = require("utf8")
        const crypto = require("crypto")
        if (!uri || !saName || !saKey) {
            throw "Missing required parameter"
        }
        const encoded = encodeURIComponent(uri)
        const now = new Date()
        const week = 60 * 60 * 24 * 7
        const ttl = Math.round(now.getTime() / 1000) + week
        const signature = encoded + "\n" + ttl
        const signatureUTF8 = utf8.encode(signature)
        const hash = crypto.createHmac("sha256", saKey).update(signatureUTF8).digest("base64")
        return {
            accessToken:
                "SharedAccessSignature sr=" + encoded + "&sig=" + encodeURIComponent(hash) + "&se=" + ttl + "&skn=" + saName,
            url: uri,
            expires: ttl,
        } as Token
    }

    async updateRequest(request: RequestResponse) {
        const token = await this.getToken()
        await Axios.post(token.url, request, {
            headers: {
                Authorization: token.accessToken,
            },
        }).catch((err) => {
            logger.error({
                message: `Erro ao enviar evento para o BigData`,
                stack: err.stack,
                bigdataEndpoint: token.url,
                tokenExp: token.expires,
            })
        })
        return request
    }

    async createRequest(request: RequestResponse): Promise<RequestResponse> {
        // no mongodb a gente criava de fato um registro
        // no bigdata pode ser que haja algum evento que nao chegue no
        // update e fique perdido
        return request
    }
}

interface Token {
    expires: number
    url: string
    accessToken: string
}
