import { initDependencies, iocContainer } from "../../../../src/inversify/inversify.config"
import { SmartphoneSoldProposalRepository } from "../../../../src/modules/smartphoneProposal/repository/SmartphoneSoldProposalRepository"

initDependencies()

describe("SmartphoneSoldProposalRepository", () => {
    let smartphoneSoldProposalRepository: SmartphoneSoldProposalRepository

    beforeEach(async () => {
        smartphoneSoldProposalRepository = iocContainer.get("SmartphoneSoldProposalRepository")
    })

    it("buscar informações de compra baseado no id do usuário", async () => {
        const getInfoFromCostumer = await smartphoneSoldProposalRepository.listSoldProposal()
        const costomerId = getInfoFromCostumer[0].customerId
        const customerInfo = await smartphoneSoldProposalRepository.findAllFromCustomer(costomerId)
        expect(customerInfo).toBeDefined()
    })
})
