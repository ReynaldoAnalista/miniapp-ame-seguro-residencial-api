import { initDependencies, iocContainer } from "../../../../src/inversify/inversify.config";
import { PlanRepository } from "../../../../src/modules/plan/repository/PlanRepository";
import { PlanService } from "../../../../src/modules/plan/services/PlanService";

initDependencies()

describe("PlanService", () => {

    let planRepository: PlanRepository
    let planService: PlanService

    beforeEach(async () => {
        planRepository = iocContainer.get("PlanRepository")
        planService = iocContainer.get("PlanService")
    })

    it("salva e le um plano", async () => {
        let proposal: any = {
            email: 'dev@gmail.com'
        }
        await planService.sendProposal(proposal)
        const plan = await planRepository.findByEmail('dev@gmail.com')
        console.log(plan)
    })



})