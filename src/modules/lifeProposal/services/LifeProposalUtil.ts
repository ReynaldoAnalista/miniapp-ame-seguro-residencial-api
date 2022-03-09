import { injectable, inject } from "inversify"
import { getLogger } from "../../../server/Logger"
import { TYPES } from "../../../inversify/inversify.types"
import moment from "moment"
import { AuthTokenService } from "../../authToken/services/AuthTokenService"
import { RequestService } from "../../authToken/services/RequestService"
import { Tenants } from "../../default/model/Tenants"
import { ParameterStore } from "../../../configs/ParameterStore"

const log = getLogger("LifeProposalUtil")

@injectable()
export class LifeProposalUtil {
    constructor(
        @inject(TYPES.ParameterStore)
        private parameterStore: ParameterStore,
        @inject("AuthTokenService") private authTokenService: AuthTokenService,
        @inject("RequestService") private requestService: RequestService
    ) {}

    async formatCotation(cotation) {
        return {
            product_code: await this.filterPlanNameFromDate(cotation.birth_date),
            proponent: {
                tax_id: "16286131736",
                occupation_code: 5,
                birth_date: cotation.birth_date,
                gender: cotation.gender,
                income_amount: cotation.income_amount,
                retired: 1,
                proponent_health_input: {
                    smoker: false,
                },
            },
            coverage: cotation.coverage,
        }
    }

    async filterPlanNameFromDate(date) {
        const idade = String(moment().diff(date, "years")).substr(1, 2)
        if (idade === "0" || idade === "5") {
            return "57208_0_1"
        }
        if (idade === "2" || idade === "7") {
            return "57208_0_3"
        }
        if (idade === "3" || idade === "8") {
            return "57208_0_4"
        }
        if (idade === "4" || idade === "9") {
            return "57208_0_5"
        }
        if (idade === "1" || idade === "6") {
            return "57208_0_2"
        }
    }

    async getCotation(cotation: any) {
        log.debug("Sending proposal to Partner")
        let result
        try {
            const response = await this.requestService.makeRequest(
                this.requestService.ENDPOINTS.LIFE_URL_BASE,
                this.requestService.METHODS.POST,
                cotation,
                Tenants.LIFE,
                "/rest-seguro-vida/cotacoes?company_code=0514"
            )
            result = { success: true, content: response.data }
            log.info("Success proposal sent")
        } catch (e) {
            const status = e.response?.status
            const statusText = e
            result = { success: false, status: status, message: statusText }
            log.error(`Error %j`, statusText)
            log.debug("Error when trying to send proposal")
            log.debug(`Status Code: ${status}`)
        }
        return result
    }
}
