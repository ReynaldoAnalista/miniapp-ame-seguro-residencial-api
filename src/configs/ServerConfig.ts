import { injectable, inject } from "inversify"
import { TYPES } from "../inversify/inversify.types"
import { AppConfig } from "./AppConfig"

@injectable()
export class ServerConfig {
    private readonly _port: number
    private readonly _context: string

    constructor(@inject(TYPES.AppConfig) _appConfig: AppConfig) {
        this._port = _appConfig.serverConfig.port
        this._context = _appConfig.serverConfig.context
    }

    public get port(): number {
        return this._port
    }

    public get context(): string {
        return this._context
    }

}
