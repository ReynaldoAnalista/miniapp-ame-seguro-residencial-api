import { inject, injectable } from "inversify"
import { getLogger } from "../../../server/Logger"
import { LifeProposalUtil } from "./LifeProposalUtil"

const log = getLogger("LifeProposalService")

@injectable()
export class LifeProposalService {
    constructor(@inject("LifeProposalUtil") private lifeProposalUtil: LifeProposalUtil) {}

    async cotation(cotationPropose: any) {
        const formatPropose = await this.lifeProposalUtil.formatCotation(cotationPropose)
        const sendCotation = await this.lifeProposalUtil.getCotation(formatPropose)
        return sendCotation
    }
}
