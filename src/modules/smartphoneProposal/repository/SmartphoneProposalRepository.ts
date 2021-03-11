import {injectable, inject} from "inversify";
import {DynamoHolder} from "../../../repository/DynamoHolder";
import {getLogger} from "../../../server/Logger";

const TABLE = `${process.env.DYNAMODB_ENV}_seguro_celular_compras`;

const log = getLogger("SmartphoneProposalRepository")

@injectable()
export class SmartphoneProposalRepository {

    static TABLE = TABLE

    constructor(
        @inject("DynamoHolder")
        private dynamoHolder: DynamoHolder
    ) {
    }

    async checkTable() {
        log.debug(`Checking table: ${TABLE}`)
        try {
            let dynamoDocClient = await this.dynamoHolder.getDynamoDocClient();
            await dynamoDocClient.get({
                TableName: TABLE,
                Key: {
                    "id": "a"
                }
            }).promise();
            return true
        } catch (e) {
            log.error(`Table ${TABLE} not exists`)
            log.error(e)
        }
        return false
    }

    async create(proposal: any) {
        log.debug('TRYING TO WRITE ON', TABLE);
        let dynamoDocClient = await this.dynamoHolder.getDynamoDocClient();
        let params = {TableName: TABLE, Item: proposal};
        await dynamoDocClient.put(params).promise();
        log.debug('REGISTER WROTE ON', TABLE);
        return proposal
    }

    async findByID(id: string) {
        log.debug(`Searching on table: ${TABLE} for id: ${id}`)
        let params = {
            TableName: TABLE,
            Key: {
                "id": id
            }
        };
        let dynamoDocClient = await this.dynamoHolder.getDynamoDocClient();
        let result = await dynamoDocClient.get(params).promise();
        if (result.Item) {
            log.debug("Have found")
            return result.Item
        }
        log.debug("Not found")
        return null
    }

    async update(proposal) {
        let dynamoDocClient = await this.dynamoHolder.getDynamoDocClient();
        let params = {
            TableName: TABLE,
            Item: proposal
        };
        await dynamoDocClient.put(params).promise();
        return proposal
    }

    async listProposal() {
        let dynamoDocClient = await this.dynamoHolder.getDynamoDocClient();
        let scanResult = await dynamoDocClient.scan({
            TableName: TABLE,
            FilterExpression: 'attribute_exists(id)'
        }).promise()
        if (scanResult.Count && scanResult.Items && scanResult.Items.length)
            return scanResult.Items
        else
            return []
    }

    async validateProposal(proposal) {       

        var filter : string[] = []

        var policyHolderData = proposal?.attributes?.customPayload?.proposal?.policyholder_data
        var insuredData = proposal?.attributes?.customPayload?.proposal?.insured_data
        var clientAdressData = insuredData?.address_data
        var adressData = policyHolderData?.address_data
        var equipamentRiskData = proposal?.attributes?.customPayload?.proposal?.portable_equipment_risk_data
        var coverageData = proposal?.attributes?.customPayload?.proposal?.coverage_data      
        var variablePolicyData = proposal?.attributes?.customPayload?.proposal?.variable_policy_data
        var changeTypeData = proposal?.attributes?.customPayload?.proposal?.charge_type_data
        var policyData = proposal?.attributes?.customPayload?.proposal?.policy_data

        const validProposal = {
            // Insured_data
            insured_name: typeof (insuredData?.insured_name) == 'string' && insuredData?.insured_name.length <= 60,           
            type_of_legal_person: typeof (insuredData?.type_of_legal_person) == 'string' && insuredData?.type_of_legal_person.length == 1,           
            cnpj_cpf: typeof (insuredData?.cnpj_cpf) == 'string' && insuredData?.cnpj_cpf.length <= 14,
            date_of_birth: typeof(Number(insuredData?.date_of_birth)) == 'number' && insuredData?.date_of_birth.length == 8,
            gender: typeof(insuredData?.gender) == 'string' && insuredData?.gender.length == 1,
            // client address_data
            type_of_street: typeof(clientAdressData?.type_of_street) == 'string' && clientAdressData?.type_of_street.length == 2,
            street: typeof(clientAdressData?.street) == 'string' && clientAdressData?.street.length <= 60,
            number: typeof(clientAdressData?.number) == 'string' && clientAdressData?.number.length <= 10,
            complement: typeof(clientAdressData?.complement) == 'string' && clientAdressData?.complement.length <= 10,
            district: typeof(clientAdressData?.district) == 'string' && clientAdressData?.district.length <= 20,
            city: typeof(clientAdressData?.city) == 'string' && clientAdressData?.city.length <= 20,
            zip_code: typeof(clientAdressData?.zip_code) == 'string' && clientAdressData?.zip_code.toString().length <= 9,
            federal_unit: typeof(clientAdressData?.federal_unit) == 'string' && clientAdressData?.federal_unit.length <= 3,
            // portable_equipment_risk_data
            cpf_cnpj_by_risk: typeof(equipamentRiskData?.cpf_cnpj_by_risk) == 'string' && equipamentRiskData?.cpf_cnpj_by_risk.length <= 14,
            risk_description: typeof(equipamentRiskData?.risk_description) == 'string' && equipamentRiskData?.risk_description.length <= 50,
            product_description: typeof(equipamentRiskData?.product_description) == 'string' && equipamentRiskData?.product_description.length <= 50,
            manufacturer_code: typeof(equipamentRiskData?.manufacturer_code) == 'number' && equipamentRiskData?.manufacturer_code.toString().length <= 10,
            manufacturer_name: typeof(equipamentRiskData?.manufacturer_name) == 'string' && equipamentRiskData?.manufacturer_name.length <= 50,
            model_description: typeof(equipamentRiskData?.model_description) == 'string' && equipamentRiskData?.model_description.length <= 80,
            equipment_type: typeof(equipamentRiskData?.equipment_type) == 'number' && equipamentRiskData?.equipment_type.toString().length <= 2,
            equipment_value: typeof(equipamentRiskData?.equipment_value) == 'number' && equipamentRiskData?.equipment_value.toString().length <= 9,
            invoice_number: typeof(equipamentRiskData?.invoice_number) == 'string' && equipamentRiskData?.invoice_number.length <= 10,
            invoice_date: typeof(equipamentRiskData?.invoice_date) == 'string' && equipamentRiskData?.invoice_date.length <= 8,
            device_serial_code: typeof(equipamentRiskData?.device_serial_code) == 'string' && equipamentRiskData?.device_serial_code.length <= 20,
            // coverage date
            policy_item_number: typeof(coverageData?.policy_item_number) == 'number' && coverageData?.policy_item_number.toString().length <= 6 && coverageData?.policy_item_number.toString() == '000001',
            coverage_code: typeof(coverageData?.coverage_code) == 'number' && coverageData?.coverage_code.toString().length == 1,
            insured_amount: typeof(coverageData?.insured_amount) == 'number' && coverageData?.insured_amount.toString().length <= 20,
            liquid_prize: typeof(coverageData?.liquid_prize) == 'number' && coverageData?.liquid_prize.toString().length <= 20,
            // policy_data
            mother_policy_number: typeof(policyData?.mother_policy_number) == 'string' && policyData?.mother_policy_number.length <= 13,
            start_valid_document: typeof(policyData?.start_valid_document) == 'string' && policyData?.start_valid_document.length <= 8,
            end_valid_document: typeof(policyData?.end_valid_document) == 'string' && policyData?.end_valid_document.length <= 8,
            key_contract_certificate_number: typeof(policyData?.key_contract_certificate_number) == 'string' && policyData?.key_contract_certificate_number.length <= 17,
            // policy_holder_data
            corporate_name_policyholder_name: typeof(policyHolderData?.corporate_name_policyholder_name) == 'string' && policyHolderData?.corporate_name_policyholder_name.length <= 60,
            policy_data_type_of_legal_person: typeof(policyHolderData?.type_of_legal_person) == 'string' && policyHolderData?.type_of_legal_person.length == 1,
            // cnpj_cpf		
            // address_data
            policy_data_type_of_street: typeof(adressData?.type_of_street) == 'string' && adressData?.type_of_street.length <= 2,
            policy_data_street: typeof(adressData?.street) == 'string' && adressData?.street.length <= 60,
            policy_data_number: typeof(adressData?.number) == 'string' && adressData?.number.length <= 10,
            policy_data_complement: typeof(adressData?.complement) == 'string' && adressData?.complement.length <= 10,
            policy_data_district: typeof(adressData?.district) == 'string' && adressData?.district.length <= 20,
            policy_data_city: typeof(adressData?.city) == 'string' && adressData?.city.length <= 20,
            policy_data_zip_code: typeof(adressData?.zip_code) == 'number' && adressData?.zip_code.toString().length <= 9,
            policy_data_federal_unit: typeof(adressData?.federal_unit) == 'string' && adressData?.federal_unit.length <= 2,
            // variable policy data
            proposal_number: typeof(variablePolicyData?.proposal_number) == 'number' && variablePolicyData?.proposal_number.toString().length <= 14, 
            insurance_certificate_number: typeof(variablePolicyData?.insurance_certificate_number) == 'string' && variablePolicyData?.insurance_certificate_number.length <= 9,
            proposal_date: typeof(variablePolicyData?.proposal_date) == 'string' && variablePolicyData?.proposal_date.length <= 8,
            policy_commission: typeof(variablePolicyData?.policy_commission) == 'number' && variablePolicyData?.policy_commission.toString().length <= 5,
            policy_cost: typeof(variablePolicyData?.policy_cost) == 'number' && variablePolicyData?.policy_cost.toString().length <= 17,
            // charge_type_data
            type_of_collection_manager: typeof(changeTypeData?.type_of_collection_manager) == 'string' && changeTypeData?.type_of_collection_manager.length <= 2,
            payment_plan_code: typeof(changeTypeData?.payment_plan_code) == 'number' && changeTypeData?.payment_plan_code.toString().length <= 8,
            payment_manager_code: typeof(changeTypeData?.payment_manager_code) == 'number' && changeTypeData?.payment_manager_code.toString().length <= 8,
            document_type: typeof(changeTypeData?.document_type) == 'string' && changeTypeData?.document_type.length <= 3,
            document_number: typeof(changeTypeData?.document_number) == 'string' && changeTypeData?.document_number.length <= 20,
            number_of_installments: typeof(changeTypeData?.number_of_installments) == 'number' && changeTypeData?.number_of_installments.toString().length <= 2,            
            first_installment_value: typeof(changeTypeData?.first_installment_value) == 'number' && changeTypeData?.first_installment_value.toString().length <= 11,            
            maturity_of_first_installment: typeof(changeTypeData?.maturity_of_first_installment) == 'string' && changeTypeData?.maturity_of_first_installment.length <= 8
        }                    
        for (const [objectValues, objectKeys] of Object.entries(validProposal)) {
            if (objectKeys == false) {                
                filter.push(objectValues)
            }
        }
        return filter
    }
}