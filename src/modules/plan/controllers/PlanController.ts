import {inject, injectable} from "inversify"
import {PlanService} from "../services/PlanService"
import {Get, Path, Route, SuccessResponse, Response} from "tsoa"
import {getLogger} from "../../../server/Logger"
import {ApiError} from "../../../errors/ApiError";

const logger = getLogger("PlanController")

@Route('/v1/plans')
@injectable()
export class PlanController {
    constructor(
        @inject("PlanService") private planService: PlanService,
    ) {
    }

    @Response(404, 'NotFound')
    @SuccessResponse("200", "Retrieved")
    @Get("/{zipCode}")
    public async retrievePlans(@Path() zipCode: string) {
        logger.debug(`Plans request starting for zipCode=${zipCode}`);
        const result: any = await this.planService.retrievePlanList("123", "1", "1", "1", zipCode, "10")
        if (result.length === 0) {
            throw new ApiError("Nothing to show", 404, `Plans not found`)
        }
        logger.debug("Plans request ended")
        return result
    }
}
