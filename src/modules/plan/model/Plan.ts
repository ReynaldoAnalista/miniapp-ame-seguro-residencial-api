export interface Plan {
    id?: string
    description?: string
    premium?: number
    coverageList: Array<Coverage>
}
export interface Coverage {
    id?:string
    description?:string
    DAPercent?:number
    value?:number
    tax?:number
    premium?:number
    deductiblePercent?:number
    minDeductibleValue?:number
}
