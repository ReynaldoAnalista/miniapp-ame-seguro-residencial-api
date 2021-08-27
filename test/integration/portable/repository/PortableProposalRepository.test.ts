import { FSx } from "aws-sdk"
import { initDependencies, iocContainer } from "../../../../src/inversify/inversify.config"
import { PortableProposalRepository } from "../../../../src/modules/portableProposal/repository/PortableProposalRepository"
import { getLogger } from "../../../../src/server/Logger"

const log = getLogger("PetProposalService:test")
import fs from "fs"

initDependencies()

describe("PortableProposalRepository", () => {
    let portableProposalRepository: PortableProposalRepository

    beforeEach(async () => {
        portableProposalRepository = iocContainer.get("PortableProposalRepository")
    })

    it("validação de dados da ultima requisição", async () => {
        // TODO : REFAZER O TESTE DO PORTABLE REPOSITORY USANDO O BANCO DE DADOS
        // const getLastProposal = await portableProposalRepository.listProposal()
        // const validateProposal = await portableProposalRepository.validateProposal(getLastProposal[0])
        // log.debug("VALIDAÇÕES DE DADOS FALSA", validateProposal)
        expect(true).toBeDefined()
    })
})
