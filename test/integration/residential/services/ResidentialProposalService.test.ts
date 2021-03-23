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
import moment from "moment";
import Plans from "../../../../src/modules/residentialProposal/services/Plans";

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
        paymentObject.attributes.customPayload.proposal.dataInicioVigencia = moment().add(1, 'd').format('YYYY-MM-DD')
        paymentObject.attributes.customPayload.proposal.pagamento.dataVencimento = moment().add(30, 'd').format('YYYY-MM-DD')
        const signedPayment = await sign(paymentObject, secret)
        console.log('Assinou o arquivo de callback')
        const proposalProtocol = await residentialProposalService.processProposal(signedPayment)
        console.log('Enviou a proposta para a previsul')
        expect(proposalProtocol.result).toBeDefined()
    })

    it("Recebe todos os planos e envia pra Previsul", async() => {
        console.log('Buscando todos os planos')
        const allPlans = Plans.map((x) => { return x.id  })       
        console.log('Filtrando todos os planos')        
        const filterPlans = await Promise.all(allPlans.map(async planId =>  {
            try {
                return await retrivePlanRequest(planId);                                        
            } catch(ex) {
                return {
                    error: `Id do Plano: ${planId} - Erro: ${ex}`
                }
            }
        }))
        const errorPlains = filterPlans.filter((x) => { return x.error })
        console.log('Erros dos planos', errorPlains);
        expect(errorPlains.length).toBe(0)
    })

    afterAll( async () => {
        await residentialSoldProposalRepository.deleteByCustomerAndOrder(customerId, orderId)
        iocContainer.unbindAll()
    })    

    async function retrivePlanRequest(planId: string = '117030111') {
        const payment = await readFile(path.resolve(__dirname, "../../../fixtures/residentialNotification.json"), "utf-8")
        const secret = await parameterStore.getSecretValue("CALINDRA_JWT_SECRET")        
        const paymentObject = JSON.parse(payment)        
        paymentObject.id = orderId
        paymentObject.attributes.customPayload.proposal.cpf = generate()
        paymentObject.attributes.customPayload.proposal.customerId = customerId
        paymentObject.attributes.customPayload.proposal.dataInicioVigencia = moment().add(1, 'd').format('YYYY-MM-DD')
        paymentObject.attributes.customPayload.proposal.pagamento.dataVencimento = moment().add(30, 'd').format('YYYY-MM-DD')
        paymentObject.attributes.customPayload.proposal.planoId = planId
        const signedPayment = await sign(paymentObject, secret)        
        const proposalProtocol = await residentialProposalService.processProposal(signedPayment)
        return proposalProtocol
    }

})