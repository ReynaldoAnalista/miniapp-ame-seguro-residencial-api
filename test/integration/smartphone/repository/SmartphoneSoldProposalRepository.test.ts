import { initDependencies, iocContainer } from "../../../../src/inversify/inversify.config";
import { SmartphoneSoldProposalRepository } from "../../../../src/modules/smartphoneProposal/repository/SmartphoneSoldProposalRepository";

initDependencies()

describe("SmartphoneSoldProposalRepository", () => {
    
    let smartphoneSoldProposalRepository: SmartphoneSoldProposalRepository
    
    beforeEach(async () => {
        smartphoneSoldProposalRepository= iocContainer.get("SmartphoneSoldProposalRepository")
    })

    it("buscar informações de compra baseado no id do usuário", async () => {
        let costumerId = 'f0548f1a-826f-4956-9c80-6b007a2a2be4'
        // const getInfoFromCostumer = await smartphoneSoldProposalRepository.findAllFromCustomer(costumerId)
        const verifyTable= await smartphoneSoldProposalRepository.checkTable()
        console.debug('getInfoFromCostumer', verifyTable)
    })
    
})