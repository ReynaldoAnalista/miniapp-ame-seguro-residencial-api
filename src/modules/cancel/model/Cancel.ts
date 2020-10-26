export interface Cancel {
    nsu?: string
    codeProduct?:string
    userType?:string // "DISTRIBUIDOR",
    cancellationReason?:string //"DESISTENCIA_COMPRA",
    note?:string // "Cliente tentou trocar numa área sem atendimento"
}

export interface vouchers {
    code?: string
}
