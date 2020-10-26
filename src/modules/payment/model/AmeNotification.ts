
export interface AmePayment {
    id: string
    operationType: string
    name: string
    title: string
    description: string
    status: string
    type: string
    currency: string
    cashType: string
    amount: number
    amountRefunded: number

    attributes: AmeAttributes
}

export interface AmeNotification {
    /**
     * Pagamento assinado
     */
    signedPayment: string
}

export interface AmeAttributes {
    customPayload: ValeGasPayload
}

export interface ValeGasPayload {
    dataToUseVoucher: ValeGasDataToUseVoucher
}

export interface ValeGasDataToUseVoucher {
    userType?: string
    products?: ProductsVg[]
    consumer: ConsumerVg
    amount: number
    paymentMethod: string
    couponCode: string
    couponDiscount: string
    location: LocationVg
}

export interface ProductsVg {
    codeProduct: string
    priceProduct: number
    quantity: number
}

export interface ConsumerVg {
    cellphoneCOnsumer: CellPhoneConsumer
    nameConsumer: string
    documentTypeConsumer: string
    documentConsumer: string
    emailConsumer: string
}

export interface CellPhoneConsumer {
    areaCode: string
    number: string
}
export interface LocationVg {
    latitude: number
    longitude:number
}
