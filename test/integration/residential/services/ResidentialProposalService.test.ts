import {initDependencies, iocContainer} from "../../../../src/inversify/inversify.config";
import {ResidentialProposalRepository} from "../../../../src/modules/residentialProposal/repository/ResidentialProposalRepository";
import {ResidentialProposalService} from "../../../../src/modules/residentialProposal/services/ResidentialProposalService";
import {ParameterStore} from "../../../../src/configs/ParameterStore";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';
import { generate } from 'gerador-validador-cpf';
import delay from 'delay';


import path from "path";
import util from "util";
import fs from "fs";

import {RequestService} from "../../../../src/modules/authToken/services/RequestService";
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

    it("Recebe todos os planos e envia pra Previsul", async() => {
        console.log('Buscando todos os planos')
        const allPlans = Plans.map((x) => { return { 
            id: x.id, 
            descricao: x.descricao,
            premio: Number(x.premio.toString().replace('.', ''))
        }})
        console.log('Filtrando todos os planos')        

        const filterPlans = await Promise.all(allPlans.map(async x =>  {
            try {          
                await delay(2000);
                return retrivePlanRequest(x.id, x.descricao, x.premio)
            } catch(ex) {        
                await delay(2000);
                return {error: `Id do Plano: ${x.id} - Erro: ${ex}`}
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

    async function retrivePlanRequest(planId: string = '117030111', descricaoPlano: string = 'Proteção Essencial', premio: number = 14424) {
        try {
            const payment = await readFile(path.resolve(__dirname, "../../../fixtures/residentialNotification.json"), "utf-8")
            const secret = await parameterStore.getSecretValue("CALINDRA_JWT_SECRET")        
            const paymentObject = JSON.parse(payment)        
            paymentObject.id = orderId
            paymentObject.attributes.customPayload.proposal.cpf = generate()
            paymentObject.attributes.customPayload.proposal.customerId = customerId
            paymentObject.attributes.customPayload.proposal.dataInicioVigencia = moment().add(1, 'd').format('YYYY-MM-DD')
            paymentObject.attributes.customPayload.proposal.pagamento.dataVencimento = moment().add(30, 'd').format('YYYY-MM-DD')        
            paymentObject.attributes.customPayload.proposal.planoId = planId
            paymentObject.description = descricaoPlano
            paymentObject.amount = premio  
            const signedPayment = await sign(paymentObject, secret)                
            const proposalProtocol = await residentialProposalService.processProposal(signedPayment)     
            await delay(5000);      
            if(typeof proposalProtocol == 'undefined') {
                return {error : `erro no ID : ${planId}`}
            }            
            return proposalProtocol        
        } catch(err) {
            return err
        }        
    }    
      
})