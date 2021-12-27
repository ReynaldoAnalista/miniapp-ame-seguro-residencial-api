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
                diha: 0.65,
                funeral: 0.46,
                sorteio_liquido: 0.48,
            },
            {
                min: 31,
                max: 40,
                morte: 3.08,
                ipa: 1.28,
                diha: 0.65,
                funeral: 0.7,
                sorteio_liquido: 0.48,
            },
            {
                min: 41,
                max: 50,
                morte: 8.88,
                ipa: 1.28,
                diha: 0.65,
                funeral: 1.87,
                sorteio_liquido: 0.48,
            },
            {
                min: 51,
                max: 60,
                morte: 18.37,
                ipa: 1.28,
                diha: 0.65,
                funeral: 3.78,
                sorteio_liquido: 0.48,
            },
        ]
    }

    async cotation(request: any) {
        const cotation = await this.healthCareCotationInfo()
        const finalCotation = cotation
            .filter((x) => request.age >= x.min && request.age <= x.max)
            .map((x) => {
                return {
                    voce: (x.morte * request.range + x.ipa * request.range + x.diha + x.funeral + x.sorteio_liquido).toFixed(2),
                    familia: (
                        x.morte / 2 +
                        x.morte * request.range +
                        x.ipa * request.range +
                        x.diha +
                        x.funeral +
                        x.sorteio_liquido
                    ).toFixed(2),
                }
            })
        return finalCotation
    }

    async proposal(signedPayment: any) {
        const unsignedPayment = await this.authTokenService.unsignNotification(signedPayment)
        const firstLuckNumber = await this.findLuckNumber()
        unsignedPayment.attributes.customPayload.proposal.lucky_number = firstLuckNumber?.luck_number
        const proposalResponse = await this.sendProposal(unsignedPayment.attributes.customPayload.proposal)
        await this.saveSoldProposal(unsignedPayment, proposalResponse)
        await this.setUsedLuckNumber(unsignedPayment.attributes.customPayload.proposal, firstLuckNumber)
        return proposalResponse
    }

    async findLuckNumber() {
        return await this.luckNumberRepository.findFirstLuckNumber()
    }

    async sendProposal(payment: any) {
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
