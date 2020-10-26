import {inject, injectable} from "inversify";
import {getLogger} from "../../../server/Logger";
import {TYPES} from "../../../inversify/inversify.types";
import {AuthTokenService} from "../../authToken/services/AuthTokenService";
import {Voucher} from "../../transactions/model/Voucher";
import {ParameterStore} from "../../../configs/ParameterStore";
import { Transaction } from "../model/Transaction"
import {RequestService} from "../../authToken/services/RequestService";


const logger = getLogger("TransactionsService")

@injectable()
export class TransactionsService {

    constructor(
        @inject("AuthTokenService")
        private authTokenService: AuthTokenService,
        @inject(TYPES.ParameterStore)
        private parameterStore: ParameterStore,
        @inject("RequestService")
        private requestService: RequestService
    ) {
    }

    /**
     * Serviço retorna a lista de transações por telefone
     * @param phone
     */
    async retrieveTransactions(ddd: string, phone:string) {
        logger.debug("TransactionsService: retrieveTransactions");

        try{
            const token = await this.authTokenService.retrieveAuthorization();

            let transactions: Transaction[] = await this.requestService.webRequestCreateTransactions('transactions?', ddd, phone, token);

            let available: any[] = []  // avaialability value = 1
            let exchanged: any[] = []     // avaialability value = x e validationDate preenchido
            let allCanceled: any[] = []   // avaialability value = x e validationDate = ""

            for (let trans of transactions)  {
                let intersection = trans.productsVouchers[0].voucherAuthorizationCode
                let voucherCorresp: Voucher = await this.requestService.webRequestCreateVouchers(intersection, token)
                let intersectionIndetified = voucherCorresp[0].code

                if (intersection === intersectionIndetified) {
                    const newInfo = {...trans, ...voucherCorresp[0]}
                    const model: any = {
                        nsu: newInfo.nsu,
                        latitude: newInfo.latitude ,
                        longitude: newInfo.longitude,
                        voucherAuthorizationCode: newInfo.code,
                        saleDate: newInfo.time,
                        validationDate: newInfo.validationDate,
                        availability: newInfo.availability.value,
                        productCode: newInfo.product.code,
                        productDescription: newInfo.product.description,
                        price:newInfo.productsVouchers[0].productPrice
                    }

                    if (newInfo.availability.value === 1) {available.push(model)}
                    else {(newInfo.validationDate != "") ? exchanged.push(model) : allCanceled.push(model)}
                }
            }
            // filtra as transações duplicadas (VENDA,CANCELADO) e retorna somente uma transação para cada voucher
            let canceled = Array.from(new Set(allCanceled.map(item => item.voucherAuthorizationCode)))
                    .map(item => {
                        return allCanceled.find(j => j.voucherAuthorizationCode === item)
                    })
            let result: any = {available, exchanged, canceled}

            return result
        }catch(err){
            console.log('Ocorreu algum erro ao tentar gerar a requisição.');
            return {};
        }
    }
}