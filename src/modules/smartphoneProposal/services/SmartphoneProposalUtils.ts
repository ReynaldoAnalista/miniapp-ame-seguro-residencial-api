import moment from "moment";

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

export class SmartphoneProposalUtils {
    static generateProposal(insuredData: InsuredData, coverageData: CoverageData) {
        return {
            // Grupo de informações da ápolice
            "policy_data": this.generatePolicyData(),

            // Grupo de informações do Tomador
            "policyholder_data": this.generatePolicyHolderData(),

            // Grupo de informações do Segurado
            "insured_data": this.generateInsuredData(insuredData),

            // Grupo de informações dos dados da proposta
            "variable_policy_data": this.generateVariablePolicyData(),

            // Informações dos tipos de risco por equipamento
            "portable_equipment_risk_data": this.generatePortableEquipmentRiskData(),

            // Informações da cobertura
            "coverage_data": this.generateCoverageData(coverageData),

            // Informações da cobrança
            "charge_type_data": this.generateChargeData()
        }
    }

    static generatePolicyData() {
        // Todas as apólices são ligadas à uma apólice mãe única
        const motherPolicyNumber = "6944000861071";

        //
        const keyContractCertificateNumber = 27394794;

        // Início da Vigência da apólice
        let toDay = moment(new Date());
        const startValidDocument = toDay.format('ddMMyyyy');

        // Fim da Vigência da apólice
        toDay.add(1, "year");
        const endValidDocument = toDay.format('ddMMyyyy');

        return {
            "mother_policy_number": motherPolicyNumber,
            "start_valid_document": startValidDocument,
            "end_valid_document": endValidDocument,
            "key_contract_certificate_number": keyContractCertificateNumber
        }
    }

    static generatePolicyHolderData() {

        // Razão Social da AME DIGITAL, a Ame precisa nos passar essa informação
        const corporateNamePolicyholderName = "AME DIGITAL BRASIL LTDA";

        // Pessoa Física ou Jurídica, Ame precisa nos passar como F ou J
        const typeOfLegalPerson = "J";

        // CNPJ da AME
        const cnpjCpf = "32778350000170";

        // Tipo de endereço da AME, informar como (1 rua , 2 avenida e 83 N/D)
        const typeOfStreet = "01";

        // Endereço da AME
        const street = "Rua Fidêncio Ramos";
        const number = "302";
        const complement = "Torre B 9º andar";
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

    static generateInsuredData(insuredData: InsuredData) {
        return {
            "insured_name": insuredData.insuredName,
            "type_of_legal_person": insuredData.typeOfLegalPerson,
            "cnpj_cpf": insuredData.cnpjCpf,
            "date_of_birth": insuredData.dateOfBirth,
            "gender": insuredData.gender,
            "address_data": {
                "type_of_street": insuredData.typeOfStreet,
                "street": insuredData.street,
                "number": insuredData.number,
                "complement": insuredData.complement,
                "district": insuredData.district,
                "city": insuredData.city,
                "zip_code": insuredData.zipCode,
                "federal_unit": insuredData.federalUnit
            }
        }
    }

    static generateVariablePolicyData() {
        //Número da proposta a ser gerada pela AME
        const proposalNumber = 20536270000;

        //Ainda sem definição
        const insuranceCertificateNumber = "10220180000";

        //Data da proposta do seguro (inicio da vigência), informado pela AME
        const proposalDate = "01222018";

        //Comissão da apólice, informado pela AME
        const policyCommission = 35;

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

    static generatePortableEquipmentRiskData() {

        // CPF por risco, acredito que pode ser o mesmo cpf do segurado, informado pela AME
        const cpfCnpjByRisk = 47156984523;

        // MESMA DESCRIÇÃO DO BEM SEGURADO abaixo, informado pela AME
        const riskDescription = "CELULAR LG K10 PRO 5.7";

        // Descrição do bem segurado, informado pela AME
        const productDescription = "CELULAR LG K10 PRO 5.7";

        // Caso não tenha, enviar 1, informado pela AME
        const manufacturerCode = 1;

        // Nome do fabricante do aparelho, informado pela AME
        const manufacturerName = "LG CELULAR SP";

        // Descrição do bem segurado, informado pela AME
        const modelDescription = 1;

        // Enviar 2, informado pela AME
        const equipmentType = 2;

        // Valor do bem, informado pela AME
        const equipmentValue = 999.90;

        // Número da nota fiscal, informado pela AME
        const invoiceNumber = 1258745698;

        // Data da nota fiscal, informado pela AME
        const invoiceDate = "10222018";

        // IMEI, informado pela AME
        const deviceSerialCode = "fke782521dd";

        return {
            "cpf_cnpj_by_risk": cpfCnpjByRisk,
            "risk_description": riskDescription,
            "product_description": productDescription,
            "manufacturer_code": manufacturerCode,
            "manufacturer_name": manufacturerName,
            "model_description": modelDescription,
            "equipment_type": equipmentType,
            "equipment_value": equipmentValue,
            "invoice_number": invoiceNumber,
            "invoice_date": invoiceDate,
            "device_serial_code": deviceSerialCode
        }
    }

    static generateCoverageData(coverageData: CoverageData) {

        // Informar fixo 01
        const policyItemNumber = 1;

        return {
            "policy_item_number": policyItemNumber,
            "coverage_code": coverageData.coverageCode,
            "insured_amount": coverageData.insuredAmount,
            "liquid_prize": coverageData.liquidPrize
        }
    }

    static generateChargeData() {

        // (FIXO DF), informado pela AME
        const typeOfCollectionManager = "DF";

        // Mapfre ficou de enviar os planos de pagamentos, estou aguardando
        const paymentPlanCode = 723;

        // Mapfre ficou de enviar o código, estou aguardando
        const paymentManagerCode = 99990164;

        // CPF ou CGC AME
        const documentType = "CPF";

        // Número do documento AME
        const documentNumber = "13850516000177";

        // Quantidade de parcelas, informado pela AME
        const numberOfInstallments = 1;

        // Valor da primeira parcela, informado pela AME
        const firstInstallmentValue = 249.97;

        // Dia 28 do mês subsequente, informado pela AME
        const maturityOfFirstInstallment = "28032018";

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
}
