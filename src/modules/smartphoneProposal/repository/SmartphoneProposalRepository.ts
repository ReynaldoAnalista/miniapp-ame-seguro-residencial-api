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
        let params = {
            TableName: TABLE,
            Key: {
                "id": id
            }
        };
        let dynamoDocClient = await this.dynamoHolder.getDynamoDocClient();

        let result = await dynamoDocClient.get(params).promise();
        return result.Item
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

        var policyHolderData = proposal?.attributes?.customPayload?.proposal?.policyholder_data
        var insuredData = proposal?.attributes?.customPayload?.proposal?.insured_data
        var adressData = policyHolderData?.address_data
        var equipamentRiskData = proposal?.attributes?.customPayload?.proposal?.portable_equipment_risk_data
        var coverageData = proposal?.attributes?.customPayload?.proposal?.coverage_data      

        const validProposal = {
            // Insured_data
            type_of_legal_person: typeof (insuredData?.type_of_legal_person) == 'string' && insuredData?.type_of_legal_person.length == 1,           
            cnpj_cpf: typeof (insuredData?.cnpj_cpf) == 'string' && insuredData?.cnpj_cpf.length <= 14,
            date_of_birth: typeof(Number(insuredData?.date_of_birth)) == 'number' && insuredData?.date_of_birth.length == 8,
            gender: typeof(insuredData?.gender) == 'string' && insuredData?.gender.length == 1,
            // address_data
            type_of_street: typeof(adressData?.type_of_street) == 'string' && adressData?.type_of_street.length == 2,
            street: typeof(adressData?.street) == 'string' && adressData?.street.length <= 60,
            number: typeof(adressData?.number) == 'string' && adressData?.number.length <= 10,
            complement: typeof(adressData?.complement) == 'string' && adressData?.complement.length <= 10,
            district: typeof(adressData?.district) == 'string' && adressData?.district.length <= 20,
            city: typeof(adressData?.city) == 'string' && adressData?.city.length <= 20,
            zip_code: typeof(adressData?.zip_code) == 'number' && adressData?.zip_code.toString().length <= 8,
            federal_unit: typeof(adressData?.federal_unit) == 'string' && adressData?.federal_unit.length == 2,
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
            policy_item_number: typeof(coverageData?.policy_item_number) == 'number' && coverageData?.policy_item_number.toString().length <= 6,
            coverage_code: typeof(coverageData?.coverage_code) == 'number' && coverageData?.coverage_code.toString().length == 1,
            insured_amount: typeof(coverageData?.insured_amount) == 'number' && coverageData?.insured_amount.toString().length <= 20,
            liquid_prize: typeof(coverageData?.liquid_prize) == 'number' && coverageData?.liquid_prize.toString().length <= 20,
            // policy_holder_data
            corporate_name_policyholder_name: typeof(policyHolderData?.corporate_name_policyholder_name) == 'string' && policyHolderData?.corporate_name_policyholder_name.length <= 60,
            policy_data_type_of_legal_person: typeof(policyHolderData?.type_of_legal_person) == 'string' && policyHolderData?.type_of_legal_person.length == 1,
            // cnpj_cpf		
            // address_data
            policy_data_type_of_street: typeof(policyHolderData?.type_of_street) == 'string' && policyHolderData?.type_of_street.length <= 2,
            // TODO : TERMINAR DE PREENCHER OS DADOS
        } 
        
        return validProposal
    }

}
