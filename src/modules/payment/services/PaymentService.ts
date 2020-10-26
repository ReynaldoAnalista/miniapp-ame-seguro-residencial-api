import {inject, injectable} from "inversify";
import {ParameterStore} from "../../../configs/ParameterStore";
import {getLogger} from "../../../server/Logger";
import {TYPES} from "../../../inversify/inversify.types";
import {AmeNotification, AmePayment, ConsumerVg, LocationVg, ProductsVg} from "../model/AmeNotification";
import * as jwt from 'jsonwebtoken';
import {RequestService} from "../../authToken/services/RequestService";
import {AuthTokenService} from "../../authToken/services/AuthTokenService";

const log = getLogger("PaymentService")

@injectable()
export class PaymentService {

    constructor(
        @inject(TYPES.ParameterStore) private parameterStore: ParameterStore,
        @inject("RequestService") private requestService: RequestService,
        @inject("AuthTokenService") private authTokenService: AuthTokenService,
    ) {
    }

    async verifyPayment(signedPayment: string): Promise<AmePayment> {
        const secret = await this.parameterStore.getSecretValue("CALINDRA_JWT_SECRET")
        return new Promise((resolve, reject) => {
            jwt.verify(signedPayment, secret, function (err: any, decoded: any) {
                if (err) {
                    reject(new Error(`Signed payment: ${err.message}`))
                } else {
                    resolve(decoded)
                }
            });
        })
    }

    async consume(ameNotificationInput: AmeNotification) {
        log.debug('PaymentService: consume')
        let ameNotification: AmePayment = await this.verifyPayment(ameNotificationInput.signedPayment);
        log.debug("ameNotification: " + ameNotification.operationType)
        const {
            userType,
            products,
            consumer,
            amount,
            paymentMethod,
            couponCode,
            couponDiscount,
            location
        } = ameNotification.attributes.customPayload.dataToUseVoucher;
        log.debug("UserType: " + userType)
        if (userType) {
            let body = {
                "userType": userType,
                "products": products,
                "consumer": consumer,
                "amount": amount,
                "paymentMethod": paymentMethod,
                "couponCode": couponCode,
                "couponDiscount": couponDiscount,
                "location": location
            };

            log.debug("CouponCode: " + body.couponCode)
            log.debug("CouponDiscount: " + body.couponDiscount)

            const token = await this.authTokenService.retrieveAuthorization();

            return await this.requestService.webRequestCreatePayment(body, token);
        }
    }
}
