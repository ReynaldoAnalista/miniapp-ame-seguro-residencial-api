import { inject, injectable } from "inversify"
import { TYPES } from "../inversify/inversify.types"
import { AppConfig } from "./AppConfig"

@injectable()
export class PaymentApiConfig {
    private _url: string
    private _authorizePath: string

    constructor(@inject(TYPES.AppConfig) appConfig: AppConfig) {
        this._url = appConfig.paymentApiConfig.url
        this._authorizePath = appConfig.paymentApiConfig.authorizePath
    }

    public get url(): string {
        return this._url
    }

    public get authorizePath(): string {
        return this._authorizePath
    }
}
