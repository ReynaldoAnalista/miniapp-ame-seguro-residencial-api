import {inject, injectable} from "inversify"
import {ResidentialProposalService} from "../services/ResidentialProposalService"
import {Get, Path, Route, SuccessResponse, Response} from "tsoa"
import {getLogger} from "../../../server/Logger"
import {ApiError} from "../../../errors/ApiError";

const logger = getLogger("ZipCodeController")

@Route('/v1/zipcode')
@injectable()
export class ZipCodeController {
    constructor(
        @inject("ResidentialProposalService") private residentialProposalService: ResidentialProposalService,
    ) {
    }

    @Response(404, 'NotFound')
    @SuccessResponse("200", "Retrieved")
    @Get("/{zipCode}")
    public async consultZipcode(@Path() zipCode: string) {
        logger.debug(`Consult for zipCode=${zipCode}`);
        try {
            const result: any = await this.residentialProposalService.consultZipcode(zipCode)
            if (!result) {
                throw new ApiError("Nothing to show", 404, `Zipcode not found`)
            }
            logger.debug("zipcode request ended")
            return result
        } catch (e) {
            throw new ApiError("Error on retrieve zipcode", 404, JSON.stringify({trace: e.trace, apiStatus: e.status}))
        }
    }
}
