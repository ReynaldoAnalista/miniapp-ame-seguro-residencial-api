import path from "path";
import util from "util";
import fs from "fs";

import { initDependencies, iocContainer } from "../../../../src/inversify/inversify.config";
import { PetProposalService } from "../../../../src/modules/petProposal/services/PetProposalService";

const readFile = util.promisify(fs.readFile)

initDependencies()
jest.setTimeout(20000)

let petProposalService: PetProposalService
describe("PetProposalService", () => {

    beforeAll(async () => {
        petProposalService = iocContainer.get("PetProposalService")
    })
    
    it("Envio da requisição de Pet", async() => {
        const requestJson = await readFile(path.resolve(__dirname, "../../../fixtures/petNotification.json"), "utf-8")
        const request = JSON.parse(requestJson)
        const petService = await petProposalService.sendProposal(request)
        expect(petService?.status).toBe(true)
    }) 

})