import {inject, injectable} from "inversify";
import {getLogger} from "../../../server/Logger";
import {TYPES} from "../../../inversify/inversify.types";
import {AuthTokenService} from "../../authToken/services/AuthTokenService";
import {AuthToken} from "../../authToken/model/AuthToken";
import {RequestService} from "../../authToken/services/RequestService";
import {PlanRepository} from "../repository/PlanRepository";
import {AmeNotification} from "../model/AmeNotification";
import {ParameterStore} from "../../../configs/ParameterStore";
import * as jwt from 'jsonwebtoken';

const log = getLogger("PlanService")

@injectable()
export class PlanService {

    constructor(
        @inject("AuthTokenService")
        private authTokenService: AuthTokenService,
        @inject("RequestService")
        private requestService: RequestService,
        @inject("PlanRepository")
        private planRepository: PlanRepository,
        @inject(TYPES.ParameterStore)
        private parameterStore: ParameterStore
    ) {
    }

    async consultZipcode(zipcode: string) {
        log.debug("consultZipcode")
        try {
            let result: object[] = await this.requestService.makeRequest(
                this.requestService.ENDPOINTS.URL_ZIPCODE,
                this.requestService.METHODS.GET,
                null,
                `/${zipcode}`
            )
            return result
        } catch (err) {
            log.error(`Ocorreu um erro ao tentar buscar o cep ${zipcode}`);
            log.error(err)
            return null;
        }
    }

    async retrievePlanList(
        property: string,
        zipCode: string,
    ) {
        log.debug("retrievePlanList");
        const contractNumber = await this.parameterStore.getSecretValue('CONTRACT_NUMBER')
        const ameComission = await this.parameterStore.getSecretValue('AME_COMISSION')
        const brokerComission = await this.parameterStore.getSecretValue('BROKER_COMISSION')
        zipCode = zipCode.replace(/\D/g, '')
        const qs = `?contrato=${contractNumber}&ocupacao=1&imovel=${property}&construcao=1&cep=${zipCode}&comissao=${ameComission}&comissaoCorretor=${brokerComission}`
        try {
            let result: object[] = await this.requestService.makeRequest(
                this.requestService.ENDPOINTS.URL_PLANS,
                this.requestService.METHODS.GET,
                null,
                qs
            )
            return result
        } catch (err) {
            log.error('Ocorreu um erro ao tentar buscar os preços.');
            log.error(err)
            return [];
        }
    }

    async verifyPayment(signedPayment: string): Promise<any> {
        const secret = await this.parameterStore.getSecretValue("CALINDRA_JWT_SECRET")
        return new Promise((resolve, reject) => {
            jwt.verify(signedPayment, secret, function (err: any, decoded: any) {
                if (err) {
                    reject(new Error(`Signed payment: ${err.message}`))
                } else {
                    resolve(decoded)
                }
            });
        })
    }

    async sendProposal(ameNotification: AmeNotification) {
        let amePayment = await this.verifyPayment(ameNotification.signedPayment);
        // colocando na raiz para servir de chave no DynamoDB
        amePayment.email = amePayment.attributes?.customPayload?.userData?.email
        let proposal = amePayment.attributes?.customPayload?.proposal
        log.debug("sendProposal %j", proposal);
        let result, error
        let attempt = 1
        while(attempt <= 2) {
            try {
                result = await this.requestService.makeRequest(
                    this.requestService.ENDPOINTS.URL_SALE,
                    this.requestService.METHODS.POST,
                    proposal
                )
                break;
            } catch(e) {
                attempt++
                await this.delay(3000)
                error = e
                log.warn(`Error %j`, e)
            }
        }

        try {
            // result example:
            // {"guid":"6d59795e-cc81-45b6-9cb4-b00baa72836a","protocolo":"0007091120000003191"}
            await this.planRepository.create({
                email: amePayment.id,
                proposalResponse: result,
                payment: amePayment,
                attempt: attempt,
                error: {message: error?.message}
            })
            if (attempt > 2) {
                throw error
            }
            return result
        } catch (err) {
            log.error(`Ocorreu um erro ao cadastrar a proposta %j`, {data: err?.response?.data, message: err.message});
            throw err;
        }
    }

    async listProposal() {
        return this.planRepository.listProposal()
    }

    delay(ms) {
        return new Promise((resolve) => { 
            setTimeout(() => {
                resolve()
            }, ms)
        })
    }
}
