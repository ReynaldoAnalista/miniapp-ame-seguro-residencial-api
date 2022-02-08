import { inject, injectable } from "inversify"
import { getLogger } from "../../../server/Logger"

import path from "path"
import util from "util"
import fs from "fs"
import { AuthTokenService } from "../../authToken/services/AuthTokenService"
import { RequestService } from "../../authToken/services/RequestService"
import { Tenants } from "../../default/model/Tenants"
import { lifeProposalSoldRepository } from "../repository/lifeProposalSoldRepository"
import { LuckNumberRepository } from "../../maintenance/repository/LuckNumberRepository"
import { ParameterStore } from "../../../configs/ParameterStore"
import EmailSender from "./EmailSender"
import moment from "moment"

const readFile = util.promisify(fs.readFile)
const log = getLogger("LifeProposalService")

@injectable()
export class LifeProposalService {
    constructor(
        @inject("AuthTokenService") private authTokenService: AuthTokenService,
        @inject("RequestService") private requestService: RequestService,
        @inject("lifeProposalSoldRepository") private lifeProposalSoldRepository: lifeProposalSoldRepository,
        @inject("LuckNumberRepository") private luckNumberRepository: LuckNumberRepository,
        @inject("ParameterStore") private parameterStore: ParameterStore
    ) {}

    async lifeCotationInfo() {
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
        const cotation = await this.lifeCotationInfo()
        const finalCotation = cotation
            .filter((x) => request.age >= x.min && request.age <= x.max)
            .map((x) => {
                return {
                    voce: parseFloat(
                        (x.morte * request.range + x.ipa * request.range + x.diha + x.funeral + x.sorteio_liquido).toFixed(2)
                    ),
                    voce_desc: {
                        morte: x.morte,
                        ipa: x.ipa,
                        diha: x.diha,
                        funeral: x.funeral,
                    },
                    familia: {
                        morte_conjuge: x.morte_conjuge * request.range,
                        funeral_conjuge: x.funeral_conjuge,
                        funeral_pais: x.funeral_pais,
                        funeral_sogros: x.funeral_sogros,
                    },
                }
            })
        return finalCotation[0]
    }

    async proposal(signedPayment: any) {
        try {
            const unsignedPayment = await this.authTokenService.unsignNotification(signedPayment)
            const customerIdFromObject = unsignedPayment.attributes.customPayload.customerId
                .substring(unsignedPayment.attributes.customPayload.customerId.length, 20)
                .replace(/-/g, "")
            const firstLuckNumber = await this.findLuckNumber()
            unsignedPayment.attributes.customPayload.proposal.lucky_number = firstLuckNumber?.luck_number
            unsignedPayment.attributes.customPayload.proposal.insured.insured_id = customerIdFromObject
            unsignedPayment.attributes.customPayload.proposal.beneficiary = []
            const proposalResponse = await this.sendProposal(unsignedPayment.attributes.customPayload.proposal)
            await this.saveSoldProposal(unsignedPayment, proposalResponse)
            await this.setUsedLuckNumber(unsignedPayment.attributes.customPayload.proposal, firstLuckNumber)
            return proposalResponse
        } catch (e) {
            log.error("Erro ao realizar o pagamento do seguro vida", e)
        }
    }

    async sendMail(response: any) {
        const verifyProposal = await this.lifeProposalSoldRepository.findAllFromInsuredId(response)
        if (typeof verifyProposal == "undefined" || verifyProposal == []) return
        const sendMail = await this.sendSellingEmailByPaymentObject(verifyProposal[0])
        return {
            message: sendMail,
            status: 200,
        }
    }

    async sendAutomaticMail() {
        const verifyProposal = await this.lifeProposalSoldRepository.findAllFromStatusApproved()
        if (verifyProposal?.length == 0) return
        const proposalInfo = verifyProposal?.map(async (item) => {
            await this.sendMail(item.insuredId)
            const proposalMailer = {
                customerId: item.customerId,
                order: item.order,
            }
            await this.updateStatusSendMailer(proposalMailer)
        })
        return proposalInfo
    }

    async responseProposal(responseJson: any) {
        const verifyProposal = await this.lifeProposalSoldRepository.findAllFromInsuredId(responseJson.insured_id)
        if (verifyProposal?.length == 0 || typeof verifyProposal == "undefined") {
            return {
                message: "register not found",
                status: 400,
            }
        }
        const proposalInfoData = {
            order: verifyProposal[0].order,
            customerId: verifyProposal[0].customerId,
            policyNumber: responseJson.policy_number,
        }
        const updateSoldProposal = await this.lifeProposalSoldRepository.update(proposalInfoData)
        if (updateSoldProposal) {
            return {
                message: "Updated register",
                status: 200,
            }
        }
    }

    async findLuckNumber() {
        return await this.luckNumberRepository.findFirstLuckNumber()
    }

    async updateStatusSendMailer(proposal: any) {
        await this.lifeProposalSoldRepository.update(proposal, "MAILED")
    }

    async sendProposal(payment: any) {
        log.info("Sending Life Proposal to Partner")
        try {
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
            }
        } catch (e) {
            log.error("Life Proposal Error" + e)
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
            insuredId: proposal.attributes.customPayload.proposal.insured.insured_id,
            policy_number: "",
        })
        log.debug("saveSoldProposal:success")
    }

    async setUsedLuckNumber(proposal, luckNumberInfo) {
        return this.luckNumberRepository.setUsedLuckNumber(proposal, luckNumberInfo)
    }

    async sendSellingEmailByPaymentObject(unsignedPayment) {
        const email = unsignedPayment?.receivedPaymentNotification.attributes?.customPayload?.clientEmail
        log.info("Preparando o layout do e-mail")
        const emailTemplate = path.resolve(__dirname, "../../../../mail_template/life_mail.html")

        const dataToSendMail = unsignedPayment.receivedPaymentNotification.attributes.customPayload.proposal

        const coverageValue = unsignedPayment.receivedPaymentNotification.attributes.customPayload.proposal.amount_insured

        const template = await readFile(emailTemplate, "utf-8")
        const body = template
            .replace(/@@data_emissao@@/g, moment(dataToSendMail.operation_date, "MMDDYYYY").format("DD/MM/YYYY"))
            .replace(/@@nome_segurado@@/g, dataToSendMail.insured.name)
            .replace(/@@cpf_segurado@@/g, dataToSendMail.insured.cpf)
            .replace(/@@nome_logradouro@@/g, dataToSendMail.insured.address.district)
            .replace(/@@nome_cidade@@/g, dataToSendMail.insured.address.city)
            .replace(/@@complemento_endereco@@/g, dataToSendMail.insured.address.complement)
            .replace(/@@cep_endereco@@/g, dataToSendMail.insured.address.zipcode)
            .replace(/@@uf_endereco@@/g, dataToSendMail.insured.address.state)
            .replace(/@@inicio_vigencia@@/g, moment(dataToSendMail.operation_date, "MMDDYYYY").add(1, "day").format("DD/MM/YYYY"))
            .replace(
                /@@fim_vigencia@@/g,
                moment(dataToSendMail.operation_date, "MMDDYYYY").add(1, "day").add(1, "year").format("DD/MM/YYYY")
            )
            .replace(/@@importancia_segurada_morte@@/g, `${coverageValue}`)
            // .replace(/@@iof_morte@@/g, dataToSendMail.insured.state)
            .replace(/@@numero_apolice@@/g, unsignedPayment.policy_number)
            .replace(/@@numero_proposta@@/g, unsignedPayment.insuredId)
            .replace(/@@numero_sorte@@/g, dataToSendMail.lucky_number)
        const forceEmailSender = await this.parameterStore.getSecretValue("FORCE_EMAIL_SENDER")
        const accessKeyId = await this.parameterStore.getSecretValue("MAIL_ACCESS_KEY_ID")
        const secretAccessKey = await this.parameterStore.getSecretValue("MAIL_SECRET_ACCESS_KEY")
        const emailFrom = forceEmailSender ? forceEmailSender : "no-reply@amedigital.com"
        log.debug(`EmailFrom:${emailFrom}`)
        try {
            const sendResult = await EmailSender.sendEmail(emailFrom, email, body, accessKeyId, secretAccessKey)
            log.info("Email Enviado")
            return sendResult.MessageId
        } catch (e) {
            log.error("Email not sent, error", e)
            throw "Error during sending email"
        }
    }
}
