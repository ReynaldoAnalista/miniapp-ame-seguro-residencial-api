export interface Voucher {
    code: string
    saleDate:string
    validationDate:string
    availability:AvailabilityVoucher
    product:ProductVoucher

}

export interface AvailabilityVoucher {
    value:number
    description: string

}

export interface ProductVoucher {
    code:string
    description:string
}