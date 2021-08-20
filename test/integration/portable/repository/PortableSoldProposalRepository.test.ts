import { initDependencies, iocContainer } from "../../../../src/inversify/inversify.config"
import { PortableSoldProposalRepository } from "../../../../src/modules/portableProposal/repository/PortableSoldProposalRepository"

initDependencies()

describe("PortableSoldProposalRepository", () => {
    let portableSoldProposalRepository: PortableSoldProposalRepository

    beforeEach(async () => {
        portableSoldProposalRepository = iocContainer.get("PortableSoldProposalRepository")
    })

    it("buscar informações de compra baseado no id do usuário", async () => {
        const getInfoFromCostumer = await portableSoldProposalRepository.listSoldProposal()
        const costomerId = getInfoFromCostumer[0].customerId
        const customerInfo = await portableSoldProposalRepository.findAllFromCustomer(costomerId)
        expect(customerInfo).toBeDefined()
    })
})
