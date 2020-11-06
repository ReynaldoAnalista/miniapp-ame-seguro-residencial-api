import {inject, injectable} from "inversify"
import {PlanService} from "../services/PlanService"
import {Get, Path, Route, SuccessResponse, Response} from "tsoa"
import {getLogger} from "../../../server/Logger"
import {ApiError} from "../../../errors/ApiError";

const logger = getLogger("ZipCodeController")

@Route('/v1/zipcode')
@injectable()
export class ZipCodeController {
    constructor(
        @inject("PlanService") private planService: PlanService,
    ) {
    }

    @Response(404, 'NotFound')
    @SuccessResponse("200", "Retrieved")
    @Get("/{zipCode}")
    public async consultZipcode(@Path() zipCode: string) {
        logger.debug(`Consult for zipCode=${zipCode}`);
        const result: any = await this.planService.consultZipcode(zipCode)
        if (!result) {
            throw new ApiError("Nothing to show", 404, `Zipcode not found`)
        }
        logger.debug("zipcode request ended")
        return result
    }
}
