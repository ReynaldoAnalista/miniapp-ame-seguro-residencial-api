import config from "config"
import { ServerConfig } from "./ServerConfig"
import { BlindGuardianConfig } from "./BlindGuardianConfig"
import { PaymentApiConfig } from "./PaymentApiConfig"
import { injectable } from "inversify"
import { AmeApiConfig } from "./AmeApiConfig"

@injectable()
export class AppConfig {
    private readonly _serverConfig: ServerConfig
    private readonly _blindGuardianConfig: BlindGuardianConfig
    private readonly _paymentApiConfig: PaymentApiConfig
    private readonly _ameApi: AmeApiConfig

    constructor() {
        this._serverConfig = config.get("server")
        this._blindGuardianConfig = config.get("blindGuardian")
        this._paymentApiConfig = config.get("payment")
        this._ameApi = config.get("ameApi")
    }

    public get serverConfig(): ServerConfig {
        return this._serverConfig
    }

    public get blindGuardianConfig(): BlindGuardianConfig {
        return this._blindGuardianConfig
    }

    public get paymentApiConfig(): PaymentApiConfig {
        return this._paymentApiConfig
    }

    public get ameApiConfig(): AmeApiConfig {
        return this._ameApi
    }
}
