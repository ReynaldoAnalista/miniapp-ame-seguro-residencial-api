export interface Transaction {
    transactionType?: string
    time?: string
    nsu?: string
    latitude?:number
    longitude?:number
    consumer?: Consumer
    distributor?: Distributor
    productsVouchers:ProductsVouchers[]
}

export interface Consumer {
    name: string
    documentType: string
    document: string
    cellphone: CellPhone
}

export interface CellPhone {
    areaCode: string
    number: string
}

export interface Distributor {
    document: string
}

export interface ProductsVouchers {
    productCode: string
    productDescription: string
    productPrice: number
    voucherAuthorizationCode: string
    voucherStatusId: number
    voucherStatus: string
    voucherCode:string

}
