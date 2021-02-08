import { initDependencies, iocContainer } from "../../../../src/inversify/inversify.config";
import {ResidentialProposalRepository} from "../../../../src/modules/residentialProposal/repository/ResidentialProposalRepository";

initDependencies()

describe("ResidentialProposalRepository", () => {

    let residentialProposalRepository: ResidentialProposalRepository

    beforeEach(async () => {
        residentialProposalRepository = iocContainer.get("PlanRepository")
    })

    it("salva e le um plano", async () => {
        let proposal: any = {
            email: 'dev@gmail.com'
        }
        await residentialProposalRepository.create(proposal)
        const plan = await residentialProposalRepository.findByEmail('dev@gmail.com')
        console.log(plan)
    })



})
