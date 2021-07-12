import { initDependencies, iocContainer } from "../../../../src/inversify/inversify.config"
import { ResidentialProposalRepository } from "../../../../src/modules/residentialProposal/repository/ResidentialProposalRepository"
import { getLogger } from "../../../../src/server/Logger"

const log = getLogger("PetProposalService:test")
initDependencies()

describe("ResidentialProposalRepository", () => {
    let residentialProposalRepository: ResidentialProposalRepository

    beforeEach(async () => {
        residentialProposalRepository = iocContainer.get("ResidentialProposalRepository")
    })

    it("Saves and Reads a proposal", async () => {
        const proposal: any = {
            email: "dev@gmail.com",
        }
        await residentialProposalRepository.create(proposal)
        const plan = await residentialProposalRepository.findByEmail("dev@gmail.com")
        log.debug(plan)
    })
})
