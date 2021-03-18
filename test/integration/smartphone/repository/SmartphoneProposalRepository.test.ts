import { FSx } from "aws-sdk";
import { initDependencies, iocContainer } from "../../../../src/inversify/inversify.config";
import { SmartphoneProposalRepository } from "../../../../src/modules/smartphoneProposal/repository/SmartphoneProposalRepository";

import fs from 'fs';

initDependencies()

describe("SmartphoneProposalRepository", () => {
    
    let smartphoneProposalRepository: SmartphoneProposalRepository
    
    beforeEach(async () => {
        smartphoneProposalRepository= iocContainer.get("SmartphoneProposalRepository")
    })

    it("validação de dados da ultima requisição", async () => {                
        const getLastProposal = await smartphoneProposalRepository.listProposal()
        const validateProposal = await smartphoneProposalRepository.validateProposal(getLastProposal[0])                
        console.log('VALIDAÇÕES DE DADOS FALSA', validateProposal)        
        expect(validateProposal.length).toBeDefined()
    })
    
})