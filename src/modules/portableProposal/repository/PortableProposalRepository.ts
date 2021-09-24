import { injectable, inject } from "inversify"
import { DynamoHolder } from "../../../repository/DynamoHolder"
import { getLogger } from "../../../server/Logger"

const TABLE = `${process.env.DYNAMODB_ENV}_seguro_portateis_compras`

const log = getLogger("PortableProposalRepository")

@injectable()
export class PortableProposalRepository {
    static TABLE = TABLE

    constructor(
        @inject("DynamoHolder")
        private dynamoHolder: DynamoHolder
    ) {}

    async checkTable() {
        log.debug(`Checking table: ${TABLE}`)
        try {
            const dynamoDocClient = await this.dynamoHolder.getDynamoDocClient()
            await dynamoDocClient
                .get({
                    TableName: TABLE,
                    Key: {
                        id: "a",
                    },
                })
                .promise()
            return true
        } catch (e) {
            log.error(`Table ${TABLE} not exists`)
            log.error(e)
        }
        return false
    }

    async create(proposal: any) {
        log.debug("TRYING TO WRITE ON", TABLE)
        const dynamoDocClient = await this.dynamoHolder.getDynamoDocClient()
        const params = { TableName: TABLE, Item: proposal }
        await dynamoDocClient.put(params).promise()
        log.debug("REGISTER WROTE ON", TABLE)
        return proposal
    }

    async findByID(id: string) {
        log.debug(`Searching on table: ${TABLE} for id: ${id}`)
        const params = {
            TableName: TABLE,
            Key: {
                id: id,
            },
        }
        const dynamoDocClient = await this.dynamoHolder.getDynamoDocClient()
        const result = await dynamoDocClient.get(params).promise()
        if (result.Item) {
            log.debug("Have found")
            return result.Item
        }
        log.debug("Not found")
        return null
    }

    async update(proposal) {
        const dynamoDocClient = await this.dynamoHolder.getDynamoDocClient()
        const params = {
            TableName: TABLE,
            Item: proposal,
        }
        await dynamoDocClient.put(params).promise()
        return proposal
    }

    async listProposal() {
        const dynamoDocClient = await this.dynamoHolder.getDynamoDocClient()
        const scanResult = await dynamoDocClient
            .scan({
                TableName: TABLE,
                FilterExpression: "attribute_exists(id)",
            })
            .promise()
        if (scanResult.Count && scanResult.Items && scanResult.Items.length) return scanResult.Items
        else return []
    }

    async validateProposal(proposal) {
        const filter: string[] = []

        const policyHolderData = proposal?.attributes?.customPayload?.proposal?.policyholder_data
        const insuredData = proposal?.attributes?.customPayload?.proposal?.insured_data
        const clientAdressData = insuredData?.address_data
        const adressData = policyHolderData?.address_data
        const equipamentRiskData = proposal?.attributes?.customPayload?.proposal?.portable_equipment_risk_data
        const coverageData = proposal?.attributes?.customPayload?.proposal?.coverage_data
        const variablePolicyData = proposal?.attributes?.customPayload?.proposal?.variable_policy_data
        const changeTypeData = proposal?.attributes?.customPayload?.proposal?.charge_type_data
        const policyData = proposal?.attributes?.customPayload?.proposal?.policy_data

        const validProposal = {
            // Insured_data
            insured_name: {
                validate: typeof insuredData?.insured_name == "string" && insuredData?.insured_name.length <= 60,
                value: insuredData?.insured_name,
            },
            type_of_legal_person: {
                validate: typeof insuredData?.type_of_legal_person == "string" && insuredData?.type_of_legal_person.length == 1,
                value: insuredData?.type_of_legal_person,
            },
            cnpj_cpf: {
                validate: typeof insuredData?.cnpj_cpf == "string" && insuredData?.cnpj_cpf.length <= 14,
                value: insuredData?.cnpj_cpf,
            },
            date_of_birth: {
                validate: typeof Number(insuredData?.date_of_birth) == "number" && insuredData?.date_of_birth.length == 8,
                value: insuredData?.date_of_birth,
            },
            gender: {
                validate: typeof insuredData?.gender == "string" && insuredData?.gender.length == 1,
                value: insuredData?.gender,
            },
            // client address_data
            type_of_street: {
                validate: typeof clientAdressData?.type_of_street == "string" && clientAdressData?.type_of_street.length == 2,
                value: clientAdressData?.type_of_street,
            },
            street: {
                validate: typeof clientAdressData?.street == "string" && clientAdressData?.street.length <= 60,
                value: clientAdressData?.street,
            },
            number: {
                validate: typeof clientAdressData?.number == "string" && clientAdressData?.number.length <= 10,
                value: clientAdressData?.number,
            },
            complement: {
                validate: typeof clientAdressData?.complement == "string" && clientAdressData?.complement.length <= 10,
                value: clientAdressData?.complement,
            },
            district: {
                validate: typeof clientAdressData?.district == "string" && clientAdressData?.district.length <= 20,
                value: clientAdressData?.district,
            },
            city: {
                validate: typeof clientAdressData?.city == "string" && clientAdressData?.city.length <= 20,
                value: clientAdressData?.city,
            },
            zip_code: {
                validate: typeof clientAdressData?.zip_code == "string" && clientAdressData?.zip_code.toString().length <= 9,
                value: clientAdressData?.zip_code,
            },
            federal_unit: {
                validate: typeof clientAdressData?.federal_unit == "string" && clientAdressData?.federal_unit.length <= 3,
                value: clientAdressData?.federal_unit,
            },
            // portable_equipment_risk_data
            cpf_cnpj_by_risk: {
                validate:
                    typeof equipamentRiskData?.cpf_cnpj_by_risk == "string" && equipamentRiskData?.cpf_cnpj_by_risk.length <= 14,
                value: equipamentRiskData?.cpf_cnpj_by_risk,
            },
            risk_description: {
                validate:
                    typeof equipamentRiskData?.risk_description == "string" && equipamentRiskData?.risk_description.length <= 50,
                value: equipamentRiskData?.risk_description,
            },
            product_description: {
                validate:
                    typeof equipamentRiskData?.product_description == "string" &&
                    equipamentRiskData?.product_description.length <= 50,
                value: equipamentRiskData?.product_description,
            },
            manufacturer_code: {
                validate:
                    typeof equipamentRiskData?.manufacturer_code == "number" &&
                    equipamentRiskData?.manufacturer_code.toString().length <= 10,
                value: equipamentRiskData?.manufacturer_code,
            },
            manufacturer_name: {
                validate:
                    typeof equipamentRiskData?.manufacturer_name == "string" &&
                    equipamentRiskData?.manufacturer_name.length <= 50,
                value: equipamentRiskData?.manufacturer_name,
            },
            model_description: {
                validate:
                    typeof equipamentRiskData?.model_description == "string" &&
                    equipamentRiskData?.model_description.length <= 80,
                value: equipamentRiskData?.model_description,
            },
            equipment_type: {
                validate:
                    typeof equipamentRiskData?.equipment_type == "number" &&
                    equipamentRiskData?.equipment_type.toString().length <= 2,
                value: equipamentRiskData?.equipment_type,
            },
            equipment_value: {
                validate:
                    typeof equipamentRiskData?.equipment_value == "number" &&
                    equipamentRiskData?.equipment_value.toString().length <= 9,
                value: equipamentRiskData?.equipment_value,
            },
            invoice_number: {
                validate:
                    typeof equipamentRiskData?.invoice_number == "string" && equipamentRiskData?.invoice_number.length <= 10,
                value: equipamentRiskData?.invoice_number,
            },
            invoice_date: {
                validate: typeof equipamentRiskData?.invoice_date == "string" && equipamentRiskData?.invoice_date.length <= 8,
                value: equipamentRiskData?.invoice_date,
            },
            device_serial_code: {
                validate:
                    typeof equipamentRiskData?.device_serial_code == "string" &&
                    equipamentRiskData?.device_serial_code.length <= 20,
                value: equipamentRiskData?.device_serial_code,
            },
            // coverage date
            policy_item_number: {
                validate:
                    typeof coverageData?.policy_item_number == "number" &&
                    coverageData?.policy_item_number.toString().length <= 6 &&
                    coverageData?.policy_item_number.toString() == "000001",
                value: coverageData?.policy_item_number,
            },
            coverage_code: {
                validate: typeof coverageData?.coverage_code == "number" && coverageData?.coverage_code.toString().length == 1,
                value: coverageData?.coverage_code,
            },
            insured_amount: {
                validate: typeof coverageData?.insured_amount == "number" && coverageData?.insured_amount.toString().length <= 20,
                value: coverageData?.insured_amount,
            },
            liquid_prize: {
                validate: typeof coverageData?.liquid_prize == "number" && coverageData?.liquid_prize.toString().length <= 20,
                value: coverageData?.liquid_prize,
            },
            // policy_data
            mother_policy_number: {
                validate: typeof policyData?.mother_policy_number == "string" && policyData?.mother_policy_number.length <= 13,
                value: policyData?.mother_policy_number,
            },
            start_valid_document: {
                validate: typeof policyData?.start_valid_document == "string" && policyData?.start_valid_document.length <= 8,
                value: policyData?.start_valid_document,
            },
            end_valid_document: {
                validate: typeof policyData?.end_valid_document == "string" && policyData?.end_valid_document.length <= 8,
                value: policyData?.end_valid_document,
            },
            key_contract_certificate_number: {
                validate:
                    typeof policyData?.key_contract_certificate_number == "string" &&
                    policyData?.key_contract_certificate_number.length <= 17,
                value: policyData?.key_contract_certificate_number,
            },
            // policy_holder_data
            corporate_name_policyholder_name: {
                validate:
                    typeof policyHolderData?.corporate_name_policyholder_name == "string" &&
                    policyHolderData?.corporate_name_policyholder_name.length <= 60,
                value: policyHolderData?.corporate_name_policyholder_name,
            },
            policy_data_type_of_legal_person: {
                validate:
                    typeof policyHolderData?.type_of_legal_person == "string" &&
                    policyHolderData?.type_of_legal_person.length == 1,
                value: policyHolderData?.type_of_legal_person,
            },
            // cnpj_cpf
            // address_data
            policy_data_type_of_street: {
                validate: typeof adressData?.type_of_street == "string" && adressData?.type_of_street.length <= 2,
                value: adressData?.type_of_street,
            },
            policy_data_street: {
                validate: typeof adressData?.street == "string" && adressData?.street.length <= 60,
                value: adressData?.street,
            },
            policy_data_number: {
                validate: typeof adressData?.number == "string" && adressData?.number.length <= 10,
                value: adressData?.number,
            },
            policy_data_complement: {
                validate: typeof adressData?.complement == "string" && adressData?.complement.length <= 10,
                value: adressData?.complement,
            },
            policy_data_district: {
                validate: typeof adressData?.district == "string" && adressData?.district.length <= 20,
                value: adressData?.district,
            },
            policy_data_city: {
                validate: typeof adressData?.city == "string" && adressData?.city.length <= 20,
                value: adressData?.city,
            },
            policy_data_zip_code: {
                validate: typeof adressData?.zip_code == "number" && adressData?.zip_code.toString().length <= 9,
                value: adressData?.zip_code,
            },
            policy_data_federal_unit: {
                validate: typeof adressData?.federal_unit == "string" && adressData?.federal_unit.length <= 2,
                value: adressData?.federal_unit,
            },
            // variable policy data
            proposal_number: {
                validate:
                    typeof variablePolicyData?.proposal_number == "number" &&
                    variablePolicyData?.proposal_number.toString().length <= 14,
                value: variablePolicyData?.proposal_number,
            },
            insurance_certificate_number: {
                validate:
                    typeof variablePolicyData?.insurance_certificate_number == "string" &&
                    variablePolicyData?.insurance_certificate_number.length <= 9,
                value: variablePolicyData?.insurance_certificate_number,
            },
            proposal_date: {
                validate: typeof variablePolicyData?.proposal_date == "string" && variablePolicyData?.proposal_date.length <= 8,
                value: variablePolicyData?.proposal_date,
            },
            policy_commission: {
                validate:
                    typeof variablePolicyData?.policy_commission == "number" &&
                    variablePolicyData?.policy_commission.toString().length <= 5,
                value: variablePolicyData?.policy_commission,
            },
            policy_cost: {
                validate:
                    typeof variablePolicyData?.policy_cost == "number" && variablePolicyData?.policy_cost.toString().length <= 17,
                value: variablePolicyData?.policy_cost,
            },
            // charge_type_data
            type_of_collection_manager: {
                validate:
                    typeof changeTypeData?.type_of_collection_manager == "string" &&
                    changeTypeData?.type_of_collection_manager.length <= 2,
                value: changeTypeData?.type_of_collection_manager,
            },
            payment_plan_code: {
                validate:
                    typeof changeTypeData?.payment_plan_code == "number" &&
                    changeTypeData?.payment_plan_code.toString().length <= 8,
                value: changeTypeData?.payment_plan_code,
            },
            payment_manager_code: {
                validate:
                    typeof changeTypeData?.payment_manager_code == "number" &&
                    changeTypeData?.payment_manager_code.toString().length <= 8,
                value: changeTypeData?.payment_manager_code,
            },
            document_type: {
                validate: typeof changeTypeData?.document_type == "string" && changeTypeData?.document_type.length <= 3,
                value: changeTypeData?.document_type,
            },
            document_number: {
                validate: typeof changeTypeData?.document_number == "string" && changeTypeData?.document_number.length <= 20,
                value: changeTypeData?.document_number,
            },
            number_of_installments: {
                validate:
                    typeof changeTypeData?.number_of_installments == "number" &&
                    changeTypeData?.number_of_installments.toString().length <= 2,
                value: changeTypeData?.number_of_installments,
            },
            first_installment_value: {
                validate:
                    typeof changeTypeData?.first_installment_value == "number" &&
                    changeTypeData?.first_installment_value.toString().length <= 11,
                value: changeTypeData?.first_installment_value,
            },
            maturity_of_first_installment: {
                validate:
                    typeof changeTypeData?.maturity_of_first_installment == "string" &&
                    changeTypeData?.maturity_of_first_installment.length <= 8,
                value: changeTypeData?.maturity_of_first_installment,
            },
        }
        for (const [objectValues, objectKeys] of Object.entries(validProposal)) {
            if (objectKeys.validate == false) {
                filter.push(`key: ${objectValues} | invalid_value: ${objectKeys.value}`)
            }
        }
        return filter
    }
}
