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
import {Plan} from "inversify/dts/planning/plan";

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
        let attempts = 2
        do {
            try {
                let result: object[] = await this.requestService.makeRequest(
                    this.requestService.ENDPOINTS.URL_ZIPCODE,
                    this.requestService.METHODS.GET,
                    null,
                    `/${zipcode}`
                )
                attempts = 0
                return result
            } catch (err) {
                const status = err.response?.status
                if (status === 401) {
                    log.debug('Not authorized, next attempt.');
                    await this.authTokenService.retrieveAuthorization(true)
                    if (attempts === 1) {
                        log.debug('Authentication Token error');
                        throw {error: 'Authentication Error', status: status, trace: 'All authorization attempts fail'}
                    }
                    attempts = attempts - 1
                } else {
                    log.debug(`Error when retrive zipcode: ${zipcode}`);
                    log.debug(`Status Code: ${status}`)
                    log.debug(`x-b3-traceid: ${err.response?.headers['x-b3-traceid']}`)
                    attempts = 0
                    throw {
                        error: 'Error when retrive zipcode',
                        status: status,
                        trace: err.response?.headers['x-b3-traceid']
                    }
                }
            }
        } while (attempts > 0)
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
        let attempts = 2
        do {
            try {
                let result: object[] = await this.requestService.makeRequest(
                    this.requestService.ENDPOINTS.URL_PLANS,
                    this.requestService.METHODS.GET,
                    null,
                    qs
                )
                attempts = 0
                return result
            } catch (err) {
                const status = err.response?.status
                if (status === 401) {
                    log.debug('Not authorized, next attempt.');
                    await this.authTokenService.retrieveAuthorization(true)
                    if (attempts === 1) {
                        log.debug('Authentication Token error');
                        throw {error: 'Authentication Error', status: status, trace: 'All authorization attempts fail'}
                    }
                    attempts = attempts - 1
                } else {
                    log.debug('Error on retrive plans');
                    log.debug(`Status Code: ${err.response?.status}`)
                    log.debug(`x-b3-traceid: ${err.response?.headers['x-b3-traceid']}`)
                    attempts = 0
                    throw {
                        error: 'Error on retrive plans',
                        status: err.response?.status,
                        trace: err.response?.headers['x-b3-traceid']
                    }
                }
            }
        } while (attempts > 0)
    }

    async unsignPayment(signedPayment: string): Promise<any> {
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

    async sendProposalToPrevisul(proposal: any) {
        let attempts = 2;
        let result = null;
        let error
        let trace
        do {
            log.debug(`There are ${attempts} attempts left`)
            try {
                result = await this.requestService.makeRequest(
                    this.requestService.ENDPOINTS.URL_SALE,
                    this.requestService.METHODS.POST,
                    proposal
                );
                log.info('Success proposal sent')
                attempts = 0
            } catch (e) {
                const status = e.response?.status
                if (status === 401) {
                    log.debug('Not authorized, next attempt.');
                    await this.authTokenService.retrieveAuthorization(true)
                    if (attempts === 1) {
                        log.debug('Authentication Token error');
                    }
                    attempts = attempts - 1
                } else {
                    result = null
                    log.debug(`Error %j`, e)
                    error = e
                    log.debug('Error when trying to send proposal');
                    log.debug(`Status Code: ${status}`)
                    log.debug(`x-b3-traceid: ${e.response?.headers['x-b3-traceid']}`)
                    trace = e.response?.headers['x-b3-traceid']
                    await this.delay(2);
                }
            }
            attempts = attempts - 1
        } while (attempts > 0)
        if (result) {
            return result
        }
        throw `Proposal do not be sent, try ${3 - attempts} times; trace-id:${trace} ${error.toString()}`
    }

    static getDate = () => {
        const now = new Date()
        return {
            year: now.getUTCFullYear(),
            month: now.getUTCMonth(),
            day: now.getUTCDate(),
            hour: now.getUTCHours(),
            minutes: now.getUTCMinutes(),
            timestamp: now.getTime()
        }
    }

    static detachProposal(amePayment) {
        if (amePayment.attributes?.customPayload?.proposal) {
            let proposal = Object.assign({}, amePayment.attributes?.customPayload?.proposal)
            if (proposal.pagamento && proposal.pagamento.numeroParcelas) {
                proposal.pagamento.numeroParcelas = PlanService.processInstallments(amePayment)
            }
            return proposal
        } else {
            throw "The payment has not a proposal inside"
        }
    }

    async saveProposalSent(id: any, proposal: any) {
        log.debug("saveProposal")
        try {
            await this.planRepository.create({
                email: id,
                proposal,
                transactionDateTime: PlanService.getDate()
            })
            log.debug("saveProposal:success")
            return true
        } catch (e) {
            log.debug("saveProposal:Fail")
            throw `Error on saving proposal:${e.message}`
        }
    }

    async saveProposalProtocol(id: any, proposalProtocol: any) {
        log.debug("saveProposalSentSuccess")
        try {
            await this.planRepository.create({
                email: id + "_success",
                success: true,
                proposalProtocol,
                transactionDateTime: PlanService.getDate()
            })
            log.debug("saveProposalSentSuccess:success")
        } catch (e) {
            log.debug("saveProposalSentSuccess:Fail")
            log.debug(e.message)
        }
    }

    async saveProposalSentFail(id: string, error: any) {
        log.debug("saveProposalSentFail")
        try {
            await this.planRepository.create({
                email: id + "_fail",
                success: false,
                error: error,
                transactionDateTime: PlanService.getDate()
            })
            log.debug("saveProposalSentFail:success")
        } catch (e) {
            log.debug("saveProposalSentFail:Fail")
            log.debug(e.message)
        }
    }

    static processInstallments(amePayment: any) {
        let installments = amePayment.splits?.map(i => i.installments).filter(i => i)
        let installmentsInfo
        if (installments.length) {
            installmentsInfo = parseInt(`${installments[0]}`)
        } else {
            installmentsInfo = 1
        }
        return installmentsInfo
    }

    async sendProposal(proposal: any) {
        let proposalProtocol
        try {
            proposalProtocol = this.sendProposalToPrevisul(proposal)
        } catch (e) {
            log.debug("Error on sending proposal to previsul")
            log.debug(e)
        }
        if (proposalProtocol) {
            return proposalProtocol
        }
        log.debug('Proposal dont be sent, error on sending')
        throw 'Proposal dont be sent, error on sending'
    }

    checkPrice(): boolean {
        return true
    }

    async processProposal(signedPayment: string) {
        let proposalProtocol: any
        const unsignedPayment = await this.unsignPayment(signedPayment)
        const proposal = PlanService.detachProposal(unsignedPayment)
        if (this.checkPrice()) {
            await this.saveProposalSent(unsignedPayment.id, proposal)
            try {
                proposalProtocol = await this.sendProposal(proposal)
                await this.saveProposalProtocol(unsignedPayment.id, proposalProtocol)
            } catch (e) {
                await this.saveProposalSentFail(unsignedPayment.id, (e.message ? e.message : e.toString()))
            }
            log.debug("Proposal sent %j", unsignedPayment.id)
            return proposalProtocol
        } else {
            throw 'Price not match'
        }
    }

    async listProposal() {
        return this.planRepository.listProposal()
    }

    delay(seconds) {
        log.debug(`Awaiting for ${seconds} seconds`)
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve()
            }, seconds * 1000)
        })
    }
}
