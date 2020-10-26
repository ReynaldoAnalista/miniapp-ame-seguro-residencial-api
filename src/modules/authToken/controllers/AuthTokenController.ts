import {inject, injectable} from "inversify"
import { AuthTokenService } from "../services/AuthTokenService"
import {Get, Route, SuccessResponse} from "tsoa"
import {getLogger} from "../../../server/Logger"

const log = getLogger("AuthTokenController")

@Route('/v1/auth')
@injectable()
export class AuthTokenController {
    constructor(
        @inject("AuthTokenService") private authTokenService: AuthTokenService,
    ) {
    }
    /**
     * Busca o token necessario para acesso a api do parceiro
     */
    @SuccessResponse("200", "Retrieved")
    @Get('/token')
    public async retrieveAuthorization(): Promise<any> {
        log.debug('AuthTokenController: retrieveAuthorization')
        return await this.authTokenService.retrieveAuthorization();
    }


}
