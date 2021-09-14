import { inject, injectable } from "inversify"
import { getLogger } from "../../../server/Logger"
import { RequestService } from "../../authToken/services/RequestService"
import { Tenants } from "../../default/model/Tenants"

const log = getLogger("RenewPortableService")

@injectable()
export class RenewPortableService {
    constructor(
        @inject("RequestService")
        private requestService: RequestService
    ) {}

    async showUserInfo(customerId: string) {
        log.debug("Exibindo informação de portateis do usuario")
        try {
            const response = await this.requestService.makeRequest(
                this.requestService.ENDPOINTS.RENEW_PORTABLE_URL_BASE,
                this.requestService.METHODS.GET,
                null,
                Tenants.RENEW_PORTABLE,
                `/${customerId}`
            )
            return response.data
        } catch (error) {
            throw error
        }
    }
}
