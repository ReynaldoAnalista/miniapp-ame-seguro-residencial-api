import {inject, injectable} from "inversify"
import {Body, Controller, Get, Post, Query, Request, Response, Route, Security, SuccessResponse} from "tsoa"
import {getLogger} from "../../../server/Logger"
import {AmeNotification, ValeGasDataToUseVoucher} from "../model/AmeNotification";
import { PaymentService } from "../services/PaymentService"

const log = getLogger("PaymentController")

@Route('/v1/payment')
@injectable()
export class PaymentController {
    constructor(
        @inject("PaymentService") private paymentService: PaymentService,
    ) {
    }

    /**
     * Consome venda e transmite para api do parceiro
     */
    @SuccessResponse("200", "Consumed")
    @Response(203, "Error")
    @Post('/consume')
    public async consumeVouchers(@Body() ameNotification: AmeNotification) {
        log.debug('PaymentController: consumeVouchers')
        log.debug("AmeNotification: " + ameNotification.signedPayment)
        let result = await this.paymentService.consume(ameNotification)
        return result;//{consume: 'success'}
    }
}
