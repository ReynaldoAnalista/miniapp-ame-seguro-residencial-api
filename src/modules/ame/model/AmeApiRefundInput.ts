import { AmeApiInput } from "./AmeApiInput"

export class AmeApiRefundInput extends AmeApiInput {
    amount?: number

    constructor(paymentId: string, walletToken: string, amount: number) {
        super(paymentId, walletToken)
        this.amount = amount
    }
}
