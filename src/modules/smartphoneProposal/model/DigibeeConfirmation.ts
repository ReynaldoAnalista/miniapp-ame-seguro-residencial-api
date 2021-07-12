export interface DigibeeConfirmation {
    control_data: {
        key_contract_certificate_number: number
        customer_identifier_code: string
        processing_data: string
        acceptance_type: string
        shipping_file_number: number
        sequential_shipping_number: number
        rejection_reason_code: number
        rejection_description: string
    }
}
