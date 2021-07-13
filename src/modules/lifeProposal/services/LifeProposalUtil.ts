import { injectable } from "inversify"
import { getLogger } from "../../../server/Logger"
import moment from "moment"

const log = getLogger("LifeProposalUtil")

@injectable()
export class LifeProposalUtil {
    async formatProposal(proposal) {
        return {
            product_code: await this.filterPlanNameFromDate(proposal.birth_date),
            proponent: {
                tax_id: "16286131736",
                occupation_code: 5,
                birth_date: proposal.birth_date,
                gender: proposal.gender,
                income_amount: proposal.income_amount,
                retired: 1,
                proponent_health_input: {
                    smoker: false,
                },
            },
            coverage: proposal.coverage,
        }
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
