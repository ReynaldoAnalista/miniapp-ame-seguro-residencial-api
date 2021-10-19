import { inject, injectable } from "inversify"
import moment from "moment"
import { getLogger } from "../../../server/Logger"
import { AuthTokenService } from "../../authToken/services/AuthTokenService"
import { RequestService } from "../../authToken/services/RequestService"
import { Tenants } from "../../default/model/Tenants"

const log = getLogger("RenewPortableService")

@injectable()
export class RenewPortableUtils {
    constructor(
        @inject("RequestService")
        private requestService: RequestService,
        @inject("AuthTokenService")
        private authTokenService: AuthTokenService
    ) {}

    static generateProposal(unsignedProposal) {
        if (unsignedProposal?.customPayload?.proposal) {
            const proposal = Object.assign(unsignedProposal.customPayload.proposal)
            const motherPolicyNumber = "2716000099071"
            const covarageData = unsignedProposal.customPayload.proposal.coverage_data

            proposal.mother_policy_number = motherPolicyNumber
            proposal.insured_data = unsignedProposal.customPayload.proposal.insured_data
            proposal.product_data = unsignedProposal.customPayload.proposal.product_data
            proposal.coverage_data = covarageData
            proposal.charge_type_data = this.generateChargeData(covarageData.insured_amount)

            return proposal
        }
        return null
    }

    static generateChargeData(firstInstalment) {
        // Não importa o parcelamento, foi acertado que será apenas em 1 parcela para a mapfre
        const paymentPlanCode = "00000723"

        // Quantidade de parcelas, informado pela AME
        const numberOfInstallments = 1

        // Valor da primeira parcela, informado pela AME
        const firstInstallmentValue = this.formatPrice(firstInstalment)

        // Dia 28 do mês subsequente, informado pela AME (FORMATADO PARA MM-DD-YYYY)
        const maturityOfFirstInstallment = "04102021"

        return {
            payment_plan_code: paymentPlanCode,
            number_of_installments: numberOfInstallments,
            first_installment_value: firstInstallmentValue,
            maturity_of_first_installment: maturityOfFirstInstallment,
        }
    }

    formatPrice = (value) => {
        const type = "round"
        value = +(value / 100)
        const exp = -2
        if (isNaN(value) || !(typeof exp === "number" && exp % 1 === 0)) {
            return NaN
        }
        value = value.toString().split("e")
        value = Math[type](+(value[0] + "e" + (value[1] ? +value[1] - exp : -exp)))
        value = value.toString().split("e")
        return +(value[0] + "e" + (value[1] ? +value[1] + exp : exp))
    }

    static generatePolicyData(contractNumber, dateProposal: Date = new Date()) {
        // Todas as apólices são ligadas à uma apólice mãe única
        const motherPolicyNumber = "2716000099071"

        // Início da Vigência da apólice
        const toDay = moment(dateProposal)
        const startValidDocument = toDay.format("MMDDYYYY")

        // Número único do contrato
        const keyContractCertificateNumber = contractNumber
        log.debug("keyContractCertificateNumber", keyContractCertificateNumber)

        // Fim da Vigência da apólice
        toDay.add(365, "days")
        const endValidDocument = toDay.format("MMDDYYYY")

        return {
            mother_policy_number: motherPolicyNumber,
            start_valid_document: startValidDocument,
            end_valid_document: endValidDocument,
            key_contract_certificate_number: keyContractCertificateNumber,
        }
    }

    static generateVariablePolicyData(contractNumber) {
        const proposalNumber = contractNumber.slice(-14)

        const insuranceCertificateNumber = contractNumber.slice(-9)

        const proposalDate = "03022021"

        const policyCommission = 35

        const policyCost = 0

        return {
            proposal_number: proposalNumber,
            insurance_certificate_number: insuranceCertificateNumber,
            proposal_date: proposalDate,
            policy_commission: policyCommission,
            policy_cost: policyCost,
        }
    }

    static formatPrice = (value) => {
        const type = "round"
        value = +(value / 100)
        const exp = -2
        if (isNaN(value) || !(typeof exp === "number" && exp % 1 === 0)) {
            return NaN
        }
        value = value.toString().split("e")
        value = Math[type](+(value[0] + "e" + (value[1] ? +value[1] - exp : -exp)))
        value = value.toString().split("e")
        return +(value[0] + "e" + (value[1] ? +value[1] + exp : exp))
    }

    static getPaymentPlanCode = (code) => {
        switch (code) {
            case 1:
                return 301

            case 2:
                return 302

            case 3:
                return 303

            case 4:
                return 304

            case 5:
                return 1194

            case 6:
                return 1195

            case 7:
                return 1196

            case 8:
                return 1197

            case 9:
                return 1198

            case 10:
                return 1199

            case 11:
                return 1029

            case 12:
                return 1183

            default:
                return 301
        }
    }
}
