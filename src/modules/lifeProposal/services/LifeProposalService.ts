import { inject, injectable } from "inversify"
import { getLogger } from "../../../server/Logger"
import { LifeProposalUtil } from "./LifeProposalUtil"

import path from "path"
import util from "util"
import fs from "fs"
import { AuthTokenService } from "../../authToken/services/AuthTokenService"
import { RequestService } from "../../authToken/services/RequestService"
import { Tenants } from "../../default/model/Tenants"
import { lifeProposalSoldRepository } from "../repository/lifeProposalSoldRepository"
import { LuckNumberRepository } from "../../maintenance/repository/LuckNumberRepository"

const readFile = util.promisify(fs.readFile)
const log = getLogger("LifeProposalService")

@injectable()
export class LifeProposalService {
    constructor(
        @inject("AuthTokenService") private authTokenService: AuthTokenService,
        @inject("RequestService") private requestService: RequestService,
        @inject("LifeProposalUtil") private lifeProposalUtil: LifeProposalUtil,
        @inject("lifeProposalSoldRepository") private lifeProposalSoldRepository: lifeProposalSoldRepository,
        @inject("LuckNumberRepository") private luckNumberRepository: LuckNumberRepository
    ) {}

    async healthCareCotationInfo() {
        return [
            {
                min: 0,
                max: 30,
                morte: 1.9,
                ipa: 1.28,
                morte_conjuge: 0.95,
                diha: 0.65,
                funeral: 0.46,
                funeral_conjuge: 0.7,
                funeral_pais: 4.93,
                funeral_sogros: 4.93,
                sorteio_liquido: 0.48,
            },
            {
                min: 31,
                max: 40,
                morte: 3.08,
                ipa: 1.28,
                morte_conjuge: 1.54,
                diha: 0.65,
                funeral: 0.7,
                funeral_conjuge: 0.96,
                funeral_pais: 6.61,
                funeral_sogros: 6.61,
                sorteio_liquido: 0.48,
            },
            {
                min: 41,
                max: 50,
                morte: 8.88,
                ipa: 1.28,
                morte_conjuge: 4.44,
                diha: 0.65,
                funeral: 1.87,
                funeral_conjuge: 2.25,
                funeral_pais: 15.56,
                funeral_sogros: 15.56,
                sorteio_liquido: 0.48,
            },
            {
                min: 51,
                max: 60,
                morte: 18.37,
                ipa: 1.28,
                morte_conjuge: 9.19,
                diha: 0.65,
                funeral: 3.78,
                funeral_conjuge: 4.2,
                funeral_pais: 37.79,
                funeral_sogros: 37.79,
                sorteio_liquido: 0.48,
            },
        ]
    }

    async cotation(request: any) {
        try {
            const cotation = await this.healthCareCotationInfo()
            const finalCotation = cotation
                .filter((x) => request.age >= x.min && request.age <= x.max)
                .map((x) => {
                    return {
                        voce: parseFloat(
                            (x.morte * request.range + x.ipa * request.range + x.diha + x.funeral + x.sorteio_liquido).toFixed(2)
                        ),
                        familia: {
                            morte_conjuge: parseFloat((x.morte_conjuge * request.range).toFixed(2)),
                            funeral_conjuge: parseFloat(x.funeral_conjuge.toFixed(2)),
                            funeral_pais: parseFloat(x.funeral_pais.toFixed(2)),
                            funeral_sogros: parseFloat(x.funeral_sogros.toFixed(2)),
                        },
                    }
                })
            return finalCotation[0]
        } catch (e) {
            log.error("Erro ao realizar a cotacao do vida", e)
        }
    }

    async proposal(signedPayment: any) {
        try {
            const unsignedPayment = await this.authTokenService.unsignNotification(signedPayment)
            const customerIdFromObject = unsignedPayment.attributes.customPayload.customerId
            const firstLuckNumber = await this.findLuckNumber()
            unsignedPayment.attributes.customPayload.proposal.lucky_number = firstLuckNumber?.luck_number
            unsignedPayment.attributes.customPayload.proposal.insured.insured_id = customerIdFromObject
                .substring(customerIdFromObject.length, 20)
                .replace(/-/g, "")
            unsignedPayment.attributes.customPayload.proposal.beneficiary = []
            const proposalResponse = await this.sendProposal(unsignedPayment.attributes.customPayload.proposal)
            await this.saveSoldProposal(unsignedPayment, proposalResponse)
            await this.setUsedLuckNumber(unsignedPayment.attributes.customPayload.proposal, firstLuckNumber)
            return proposalResponse
        } catch (e) {
            log.error("Erro ao realizar o pagamento do seguro vida", e)
        }
    }

    async findLuckNumber() {
        return await this.luckNumberRepository.findFirstLuckNumber()
    }

    async sendProposal(payment: any) {
        try {
            log.info("Sending Life Proposal to Partner")
            const response = await this.requestService.makeRequest(
                this.requestService.ENDPOINTS.LIFE_URL_BASE,
                this.requestService.METHODS.POST,
                payment,
                Tenants.LIFE,
                "/rest-seguro-vida-metlife/contratacao"
            )
            if (response.data.success) {
                log.info("Success Life Proposal sent")
                return { success: true, content: response.data }
            } else {
                log.error("Life Proposal Error")
                throw new Error("Life Proposal Error")
            }
        } catch (e) {
            log.error("Erro no envio da proposta do vida para a Digibe", e)
        }
    }

    async saveSoldProposal(proposal: any, response) {
        log.debug("Saving soldProposal")
        const apiVersion = process.env.COMMIT_HASH || "unavailable"
        await this.lifeProposalSoldRepository.create({
            customerId: proposal.attributes.customPayload.customerId,
            order: proposal.id,
            tenant: Tenants.LIFE,
            receivedPaymentNotification: proposal,
            partnerResponse: response,
            success: response?.success,
            createdAt: new Date().toISOString(),
            apiVersion,
            status: "PROCESSED",
        })
        log.debug("saveSoldProposal:success")
    }

    async setUsedLuckNumber(proposal, luckNumberInfo) {
        return this.luckNumberRepository.setUsedLuckNumber(proposal, luckNumberInfo)
    }
}
