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

    private async verifyPayment(signedPayment: string): Promise<any> {
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

    private async sendProposalToPrevisul(payload: any) {
        let attempts = 3;
        let result = null;
        let error
        while (attempts > 0) {
            log.debug(`There are ${attempts} attempts left`)
            try {
                result = await this.requestService.makeRequest(
                    this.requestService.ENDPOINTS.URL_SALE,
                    this.requestService.METHODS.POST,
                    payload
                );
                log.info('Success proposal sent')
                attempts = 0
                break;
            } catch (e) {
                result = null
                log.debug('Erro ao enviar a proposta %j', e.response?.headers)
                log.debug(e)
                await this.delay(3000);
                error = e
            }
            attempts--
        }
        if (result) {
            return result
        }
        throw `Proposal do not be sent, try ${3 - attempts} times; ${error.toString()}`
    }

    private async saveProposalSentSuccess(id: string, proposal: any, proposalProtocol: any) {
        await this.planRepository.create({
            email: id,
            success: true,
            proposalProtocol,
            proposal
        })
    }

    private async saveProposalSentFail(id: string, proposal: any, error: any) {
        await this.planRepository.create({
            email: id,
            success: false,
            proposal,
            error: error
        })
    }

    async sendProposal(ameNotification: AmeNotification) {
        let proposalProtocol
        let proposal
        let amePayment = await this.verifyPayment(ameNotification.signedPayment);
        try {
            // colocando na raiz para servir de chave no DynamoDB
            amePayment.email = amePayment.id
            proposal = amePayment.attributes?.customPayload?.proposal
            let installments = amePayment.splits?.map(i => i.installments).filter(i => i)
            let installmentsInfo
            if (installments.length) {
                installmentsInfo = parseInt(`${installments[0]}`)
            } else {
                installmentsInfo = 1
            }
            if (proposal.pagamento && proposal.pagamento.numeroParcelas) {
                proposal.pagamento.numeroParcelas = installmentsInfo
            }
            proposalProtocol = await this.sendProposalToPrevisul(proposal)
        } catch (e) {
            log.error(e)
            try{
                this.saveProposalSentFail(amePayment.id, proposal, e.toString())
            } catch (e) {
                log.error('Error on save proposalSentFailResult')
                log.debug(e)
            }
        }
        if (proposalProtocol) {
            try{
                this.saveProposalSentSuccess(amePayment.id, proposal, proposalProtocol)
            } catch (e) {
                log.error('Error on save proposalSentSuccessResult')
                log.debug(e)
            }
            return proposalProtocol
        }

        log.error('Proposal dont be sent, error on sending')
        throw 'Proposal dont be sent, error on sending'
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
