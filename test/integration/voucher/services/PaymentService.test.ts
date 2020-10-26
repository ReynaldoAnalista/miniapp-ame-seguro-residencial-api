import { initDependencies, iocContainer } from "../../../../src/inversify/inversify.config";
import { PaymentService } from "../../../../src/modules/payment/services/PaymentService";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import util from "util";

const readFile = util.promisify(fs.readFile)
const sign = util.promisify(jwt.sign)

initDependencies()

describe("PaymentService", () => {

    let paymentService: PaymentService

    beforeEach(async () => {
        paymentService = iocContainer.get("PaymentService")
    })

    it("valida o pagamento, e sendo invalido, tem que dar erro", async () => {
        let e = await paymentService.verifyPayment('xxx.xxx.xxx').catch(e => e)
        expect(e).toBeInstanceOf(Error)
        expect(e.message).toEqual("Signed payment: invalid token")
    })

    it("valida o pagamento com sucesso", async () => {
        let payment = await readFile(path.resolve(__dirname, "../../../fixtures/notification.json"), "utf-8")
        console.log("payment: " + payment)
        let signedPayment = await sign(JSON.parse(payment), '123')
        console.log("SignedPayment: " + signedPayment)
        let validPayment = await paymentService.verifyPayment(signedPayment)
        expect(validPayment.id).toEqual("13a4fec9-c5a4-4dbb-a37a-ec31350c8663")
    })
})