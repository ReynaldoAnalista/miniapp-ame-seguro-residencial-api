import { initDependencies, iocContainer } from "../../../../src/inversify/inversify.config";
import { ResidentialProposalRepository } from "../../../../src/modules/residentialProposal/repository/PlanRepository";

initDependencies()

describe("PlanRepository", () => {

    let planRepository: ResidentialProposalRepository

    beforeEach(async () => {
        planRepository = iocContainer.get("PlanRepository")
    })

    it("salva e le um plano", async () => {
        let proposal: any = {
            email: 'dev@gmail.com'
        }
        await planRepository.create(proposal)
        const plan = await planRepository.findByEmail('dev@gmail.com')
        console.log(plan)
    })



})
