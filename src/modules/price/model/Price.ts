export interface Price {
    distributor?: DistributorPrice
    codeProduct?: any
    priceProduct?: number
    nameProduct?:string
}

export interface DistributorPrice {
    microMarket:string
    organizationId:number

}