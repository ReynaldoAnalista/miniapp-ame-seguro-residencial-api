import config from "config"
import { ServerConfig } from "./ServerConfig"
import { BlindGuardianConfig } from "./BlindGuardianConfig"
import { PaymentApiConfig } from "./PaymentApiConfig"
import { injectable } from "inversify"

@injectable()
export class AppConfig {
    private readonly _serverConfig: ServerConfig
    private readonly _blindGuardianConfig: BlindGuardianConfig
    private readonly _paymentApiConfig: PaymentApiConfig

    constructor() {
        this._serverConfig = config.get("server")
        this._blindGuardianConfig = config.get("blindGuardian")
        this._paymentApiConfig = config.get("payment")
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
}
