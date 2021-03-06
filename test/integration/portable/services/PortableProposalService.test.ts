import { initDependencies, iocContainer } from "../../../../src/inversify/inversify.config"
import { PortableProposalService } from "../../../../src/modules/portableProposal/services/PortableProposalService"
import jwt from "jsonwebtoken"
import { v4 as uuidv4 } from "uuid"

import path from "path"
import util from "util"
import fs from "fs"
import { ParameterStore } from "../../../../src/configs/ParameterStore"
import { PortableProposalRepository } from "../../../../src/modules/portableProposal/repository/PortableProposalRepository"
import { getLogger } from "../../../../src/server/Logger"
import { PortableSoldProposalRepository } from "../../../../src/modules/portableProposal/repository/PortableSoldProposalRepository"

const readFile = util.promisify(fs.readFile)
const sign = util.promisify(jwt.sign)

const log = getLogger("PetProposalService:test")

initDependencies()
jest.setTimeout(20000)

describe("PortableProposalService", () => {
    let portableProposalService: PortableProposalService
    let portableProposalRepository: PortableProposalRepository
    let portableSoldProposalRepository: PortableSoldProposalRepository
    let parameterStore: ParameterStore
    let signedPayment: any

    beforeAll(async () => {
        portableProposalService = iocContainer.get("PortableProposalService")
        portableProposalRepository = iocContainer.get("PortableProposalRepository")
        portableSoldProposalRepository = iocContainer.get("PortableSoldProposalRepository")
        parameterStore = iocContainer.get("ParameterStore")
        const payment = await readFile(path.resolve(__dirname, "../../../fixtures/portableNotification.json"), "utf-8")
        log.debug("Leu o arquivo de callback")
        const secret = await parameterStore.getSecretValue("CALINDRA_JWT_SECRET")
        log.debug("Buscou o secret na AWS")
        const paymentObject = JSON.parse(payment)
        log.debug("Realizou o parse do arquivo de callback")
        paymentObject.id = uuidv4()
        paymentObject.attributes.customPayload.customerId = uuidv4()
        signedPayment = await sign(paymentObject, secret)
    })

    it("Recebe o plano e envia para a DigiBee", async () => {
        const proposalResponse = await portableProposalService.processProposal(signedPayment)
        expect(proposalResponse.success).toEqual(true)
    })

    it("API para cancelamento", async () => {
        const cancel = await readFile(path.resolve(__dirname, "../../../fixtures/PortableCancel.json"), "utf-8")
        const cancelObject = JSON.parse(cancel)

        const getLastProposal = await portableSoldProposalRepository.listSoldProposal()
        getLastProposal[0].customerId = cancelObject.customerId
        getLastProposal[0].order = cancelObject.order
        await portableSoldProposalRepository.update(getLastProposal[0])
        const cancelProcess = await portableProposalService.cancelationProcess(cancelObject)
        expect(cancelProcess.success).toBe(true)
    })
})
