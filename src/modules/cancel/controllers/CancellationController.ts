import {decorate, inject, injectable} from "inversify"
import {CancellationService} from "../services/CancellationService"
import {Delete, Path, Route, SuccessResponse, Response, Controller} from "tsoa"
import {getLogger} from "../../../server/Logger"
import {Cancel} from "../model/Cancel";


const log = getLogger("CancellationController")

@Route('/v1/cancellation')
@injectable()
export class CancellationController {
    constructor(
        @inject("CancellationService") private cancellationService: CancellationService,
    ) {
    }

    /**
     * Cancela um voucher pelo seu código
     * @param voucherCode
     */
    @Response(422,'NotCanceled')
    @SuccessResponse("204","Canceled")
    @Delete("/cancellation/{voucherCode}")
    public async cancelVoucher( @Path() voucherCode:string ) {
        log.debug('CancellationController:cancelling');

        let result: any = await this.cancellationService.cancelVoucher(voucherCode);
        console.log(result.data)
        return Promise.resolve(result.data)

    }


}
