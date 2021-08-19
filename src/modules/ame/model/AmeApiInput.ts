export class AmeApiInput {
    token?: string
    paymentId?: string
    walletToken?: string

    constructor(paymentId: string, walletToken: string) {
        this.paymentId = paymentId
        this.walletToken = walletToken
    }
}
