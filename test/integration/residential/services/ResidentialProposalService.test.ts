import {initDependencies, iocContainer} from "../../../../src/inversify/inversify.config";
import {ResidentialProposalRepository} from "../../../../src/modules/residentialProposal/repository/ResidentialProposalRepository";
import {ResidentialProposalService} from "../../../../src/modules/residentialProposal/services/ResidentialProposalService";
import {ParameterStore} from "../../../../src/configs/ParameterStore";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';
import { generate } from 'gerador-validador-cpf';

import path from "path";
import util from "util";
import fs from "fs";

import {RequestService} from "../../../../src/modules/authToken/services/RequestService";
import {Tenants} from "../../../../src/modules/default/model/Tenants";
import {ResidentialSoldProposalRepository} from "../../../../src/modules/residentialProposal/repository/ResidentialSoldProposalRepository";

const readFile = util.promisify(fs.readFile)
const sign = util.promisify(jwt.sign)

initDependencies()
jest.setTimeout(20000)

describe("ResidentialProposalService", () => {

    let residentialProposalRepository: ResidentialProposalRepository
    let residentialProposalService: ResidentialProposalService
    let residentialSoldProposalRepository: ResidentialSoldProposalRepository
    let parameterStore: ParameterStore
    let requestService: RequestService

    let customerId: string
    let orderId: string

    beforeAll(async () => {
        residentialProposalRepository = iocContainer.get("ResidentialProposalRepository")
        residentialProposalService = iocContainer.get("ResidentialProposalService")
        residentialSoldProposalRepository = iocContainer.get("ResidentialSoldProposalRepository")
        parameterStore = iocContainer.get("ParameterStore")
        requestService = iocContainer.get("RequestService")
        customerId = uuidv4()
        orderId = uuidv4()
    })

    it("Recebe o plano e envia para a previsul", async () => {
        const payment = await readFile(path.resolve(__dirname, "../../../fixtures/residentialNotification.json"), "utf-8")
        console.log('Leu o arquivo de callback')
        const secret = await parameterStore.getSecretValue("CALINDRA_JWT_SECRET")
        console.log('Buscou o secret na AWS')
        const paymentObject = JSON.parse(payment)
        console.log('Realizou o parse do arquivo de callback')
        paymentObject.id = orderId
        paymentObject.attributes.customPayload.proposal.cpf = generate()
        paymentObject.attributes.customPayload.proposal.customerId = customerId
        const signedPayment = await sign(paymentObject, secret)
        console.log('Assinou o arquivo de callback')
        const proposalProtocol = await residentialProposalService.processProposal(signedPayment)
        console.log('Enviou a proposta para a previsul')
        expect(proposalProtocol.result).toBeDefined()
    })

    afterAll( async () => {
        await residentialSoldProposalRepository.deleteByCustomerAndOrder(customerId, orderId)
        iocContainer.unbindAll()
    })

})
