import { inject, injectable } from "inversify"
import { TYPES } from "../inversify/inversify.types"
import { AppConfig } from "./AppConfig"

@injectable()
export class AmeApiConfig {
    private _blindGuardianUrl: string
    private _paymentApi: string

    constructor(@inject(TYPES.AppConfig) _appConfig: AppConfig) {
        this._blindGuardianUrl = _appConfig.ameApiConfig.blindGuardianUrl
        this._paymentApi = _appConfig.ameApiConfig.paymentApi
    }

    get blindGuardianUrl(): string {
        return this._blindGuardianUrl
    }

    set blindGuardianUrl(value: string) {
        this._blindGuardianUrl = value
    }

    get paymentApi(): string {
        return this._paymentApi
    }

    set paymentApi(value: string) {
        this._paymentApi = value
    }
}
