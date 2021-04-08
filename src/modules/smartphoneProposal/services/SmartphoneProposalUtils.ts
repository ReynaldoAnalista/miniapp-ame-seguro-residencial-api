import moment from "moment";
import {getLogger} from "../../../server/Logger";

/**
 *  Grupo de informações do Segurado
 */
export interface InsuredData {
    // Nome do Segurado, informado pela AME
    insuredName: string

    // Pessoa Física ou Jurídica, Ame precisa nos passar como F ou J
    typeOfLegalPerson: string

    // CPF do segurado
    cnpjCpf: string

    // Data de nascimento do segurado
    dateOfBirth: string

    // Gênero do segurado
    gender: string

    // Tipo de endereço do segurado, informar como (1 rua , 2 avenida e 83 N/D)
    typeOfStreet: string

    // Endereço do segurado
    street: string
    number: string
    complement: string
    district: string
    city: string
    zipCode: number
    federalUnit: string
}

export interface CoverageData {

    // Código do pacote de vocês, a Digibee irá fazer o DE/PARA com os pacotes da Mapfre. Por favor, me enviar o que se refere cada pacote
    coverageCode: number

    // Valor da NF, informado pela AME
    insuredAmount: number

    // (VALOR DO PLANO – IOF (7,38%), informado pela AME
    liquidPrize: number
}

const log = getLogger("SmartphoneProposalUtils")

export class SmartphoneProposalUtils {

    static generateProposal(unsignedProposal) {
        if (unsignedProposal?.attributes?.customPayload?.proposal) {
            const preNumber = process.env.DYNAMODB_ENV === "prod" ? "0" : "9"
            const contractNumber = `${unsignedProposal.nsu}`.padStart(17, preNumber);
            let proposal = Object.assign(unsignedProposal.attributes.customPayload.proposal)
            proposal.policy_data = this.generatePolicyData(contractNumber, this.generateDateProposal(unsignedProposal.date))
            proposal.policyholder_data = this.generatePolicyHolderData()
            proposal.variable_policy_data = this.generateVariablePolicyData(contractNumber, unsignedProposal.amount)
            proposal.charge_type_data = this.generateChargeData(unsignedProposal.amount)                        
            return this.formatedProposalValues(proposal)
        }
        return null
    }

    static formatedProposalValues(proposal) {
        proposal.insured_data.address_data.district = proposal.insured_data.address_data.district.slice(0,20)
        proposal.insured_data.address_data.complement = proposal.insured_data.address_data.complement.slice(0,10)
        return proposal
    }

    static generatePolicyData(contractNumber, dateProposal: Date = new Date()) {
        // Todas as apólices são ligadas à uma apólice mãe única
        const motherPolicyNumber = "2716000020171";


        // Início da Vigência da apólice
        let toDay = moment(dateProposal);
        const startValidDocument = toDay.format('MMDDYYYY');

        // Número único do contrato
        const keyContractCertificateNumber = contractNumber;
        log.debug('keyContractCertificateNumber', keyContractCertificateNumber)

        // Fim da Vigência da apólice
        toDay.add(365, "days");
        const endValidDocument = toDay.format('MMDDYYYY');

        return {
            "mother_policy_number": motherPolicyNumber,
            "start_valid_document": startValidDocument,
            "end_valid_document": endValidDocument,
            "key_contract_certificate_number": keyContractCertificateNumber
        }
    }

    static generateDateProposal(date : any) {
        return new Date(date[0], date[1] - 1,date[2])
    }

    static generatePolicyHolderData() {

        // Razão Social da AME DIGITAL, a Ame precisa nos passar essa informação
        const corporateNamePolicyholderName = "AMEDIGITAL";

        // Pessoa Física ou Jurídica, Ame precisa nos passar como F ou J
        const typeOfLegalPerson = "J";

        // CNPJ da AME
        const cnpjCpf = "32778350000170";

        // Tipo de endereço da AME, informar como (1 rua , 2 avenida e 83 N/D)
        const typeOfStreet = "01";

        // Endereço da AME
        const street = "Fidencio Ramos";
        const number = "302";
        const complement = "";
        const district = "Vila Olímpia";
        const city = "São Paulo";
        const zipCode = 4551010;
        const federalUnit = "SP";
        return {
            "corporate_name_policyholder_name": corporateNamePolicyholderName,
            "type_of_legal_person": typeOfLegalPerson,
            "cnpj_cpf": cnpjCpf,
            "address_data": {
                "type_of_street": typeOfStreet,
                "street": street,
                "number": number,
                "complement": complement,
                "district": district,
                "city": city,
                "zip_code": zipCode,
                "federal_unit": federalUnit
            }
        }
    }

    static generateVariablePolicyData(contractNumber, contractValue) {

        //Número da proposta a ser gerada pela AME
        const proposalNumber = contractNumber.slice(-14)

        //Ainda sem definição
        const insuranceCertificateNumber = contractNumber.slice(-9);

        //Data da proposta do seguro (inicio da vigência), informado pela AME (FORMATADO MM-DD-YYYY)
        const proposalDate = "03022021";

        //Comissão da apólice, informado pela AME
        const policyCommission = 35

        //Custo da apólice, informar zero no caso da AME
        const policyCost = 0;


        return {
            "proposal_number": proposalNumber,
            "insurance_certificate_number": insuranceCertificateNumber,
            "proposal_date": proposalDate,
            "policy_commission": policyCommission,
            "policy_cost": policyCost
        }
    }

    static generateChargeData(firstInstalment) {

        // Não importa o parcelamento, foi acertado que será apenas em 1 parcela para a mapfre
        const installments = 1

        // (FIXO DF), informado pela AME
        const typeOfCollectionManager = "DF";

        // Mapfre ficou de enviar os planos de pagamentos, estou aguardando
        const paymentPlanCode = SmartphoneProposalUtils.getPaymentPlanCode(installments);

        // Mapfre ficou de enviar o código, estou aguardando
        const paymentManagerCode = 99990638;

        // CPF ou CGC AME
        const documentType = "CGC";

        // Número do documento AME
        const documentNumber = "32778350000170";

        // Quantidade de parcelas, informado pela AME
        const numberOfInstallments = 1;

        // Valor da primeira parcela, informado pela AME
        const firstInstallmentValue = this.formatPrice(firstInstalment);

        // Dia 28 do mês subsequente, informado pela AME (FORMATADO PARA MM-DD-YYYY)
        const maturityOfFirstInstallment = "04102021";

        return {
            "type_of_collection_manager": typeOfCollectionManager,
            "payment_plan_code": paymentPlanCode,
            "payment_manager_code": paymentManagerCode,
            "document_type": documentType,
            "document_number": documentNumber,
            "number_of_installments": numberOfInstallments,
            "first_installment_value": firstInstallmentValue,
            "maturity_of_first_installment": maturityOfFirstInstallment
        }
    }

    static formatPrice = (value) => {
        const type = 'round'
        value = +(value / 100);
        const exp = -2;
        if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
            return NaN;
        }
        value = value.toString().split('e');
        value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
        value = value.toString().split('e');
        return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
    }

    static getPaymentPlanCode = (code) => {
        switch (code) {
            case 1:
                return 301;

            case 2:
                return 302;

            case 3:
                return 303;

            case 4:
                return 304;

            case 5:
                return 1194;

            case 6:
                return 1195;

            case 7:
                return 1196;

            case 8:
                return 1197;

            case 9:
                return 1198;

            case 10:
                return 1199;

            case 11:
                return 1029;

            case 12:
                return 1183;

            default:
                return 301
        }
    }
}
