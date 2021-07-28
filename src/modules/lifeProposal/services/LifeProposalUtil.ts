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

    async formatProposal(proposal) {
        return {
            id: await this.proposalNumber(),
            module: 4, // TODO : VERIFICAR ESSE CÓDIGO
            medical_restriction: false,
            substipulator: 0,
            id_pdv: 10326,
            policy_group: await this.parameterStore.getSecretValue("LIFE_POLICY_GROUP"),
            partnership_id: 605,
            registration_data: proposal.registration_data,
            charge: {
                charge_type: 6,
                frequency: 7,
                total_prize: proposal.charge.total_prize,
                type_other_installments: 6,
            },
            coverage: proposal.coverage,
            beneficiaries: proposal.beneficiaries,
            broker: [
                {
                    type: 2,
                    id: 982462,
                    percentage: 100.0,
                },
                {
                    type: 3,
                    id: 982461,
                    percentage: 100.0,
                },
            ],
        }
    }

    async documentGenerator(proposalNumber) {
        log.debug("Get Proposal Numbert to create Document")
        let result
        try {
            const response = await this.requestService.makeRequest(
                this.requestService.ENDPOINTS.LIFE_URL_BASE,
                this.requestService.METHODS.GET,
                null,
                Tenants.LIFE,
                `/rest-seguro-vida-proposta-documento?company_code=0514&id=${proposalNumber}`
            )
            result = { success: true, content: response.data }
            log.info("Success proposal sent")
        } catch (e) {
            const status = e
            const statusText = e
            result = { success: false, status: status, message: statusText }
            log.error(`Error %j`, statusText)
            log.debug("Error when trying to send proposal")
            log.debug(`Status Code: ${status}`)
        }
        return result
    }

    async proposalNumber() {
        log.info("Get proposal number Request")

        const proposal = {
            proposal_type_number: 1,
            policy_group: await this.parameterStore.getSecretValue("LIFE_POLICY_GROUP"),
            subcontracting_party: 0,
            module: 4,
        }

        let result: any = {}
        try {
            const response = await this.requestService.makeRequest(
                this.requestService.ENDPOINTS.LIFE_URL_BASE,
                this.requestService.METHODS.POST,
                proposal,
                Tenants.LIFE,
                "/rest-seguro-vida/numero-proposta?company_code=0514"
            )
            result = response.data.proposal_numbering.proposal
            log.info("Success Get proposal number")
        } catch (e) {
            const status = e.response?.status
            const statusText = e
            result = "err_proposal_number"
            log.error(`Error %j`, statusText)
            log.debug("Error when trying to send proposal")
            log.debug(`Status Code: ${status}`)
        }
        return result
    }

    async filterPlanNameFromDate(date) {
        const idade = moment().diff(date, "years").toString().substr(1, 2)

        switch (idade) {
            case "0" || "5":
                return "57208_0_1"
            case "2" || "7":
                return "57208_0_3"
            case "3" || "8":
                return "57208_0_4"
            case "4" || "9":
                return "57208_0_5"
            case "1" || "6":
                return "57208_0_2"
        }
    }
}
