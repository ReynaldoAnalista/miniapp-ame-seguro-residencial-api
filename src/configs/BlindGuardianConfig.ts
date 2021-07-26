import { inject, injectable } from "inversify"
import { TYPES } from "../inversify/inversify.types"
import { AppConfig } from "./AppConfig"

@injectable()
export class BlindGuardianConfig {
    private _url: string
    private _authPath: string

    constructor(@inject(TYPES.AppConfig) _appConfig: AppConfig) {
        this._url = _appConfig.blindGuardianConfig.url
        this._authPath = _appConfig.blindGuardianConfig.authPath
    }

    public get url(): string {
        return this._url
    }

    public get authPath(): string {
        return this._authPath
    }
}
