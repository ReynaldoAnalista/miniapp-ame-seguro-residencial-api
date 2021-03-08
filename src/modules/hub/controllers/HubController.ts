import {inject, injectable} from "inversify"
import {Get, Path, Route, SuccessResponse, Response} from "tsoa"
import {getLogger} from "../../../server/Logger"
import {ApiError} from "../../../errors/ApiError";
import {HubService} from "../services/HubService";

const logger = getLogger("HubController")

@Route('/v1/hub')
@injectable()
export class HubController {
    constructor(
        @inject("HubService") private hubService: HubService,
    ) {
    }

    @Response(404, 'NotFound')
    @SuccessResponse("200", "Retrieved")
    @Get("/plans/{customerId}")
    public async retrievePlans(@Path() customerId: string) {
        logger.debug(`Consult plans for customerID=${customerId}`);
        try {
            const result: any = await this.hubService.retrievePlans(customerId)
            if (!result) {
                throw new ApiError("Nothing to show", 404, `Customer not found`)
            }
            logger.debug("customer request ended")
            return result
        } catch (e) {
            logger.error(e)
            throw new ApiError(`Error on retrieve plans for customer ${customerId}`, 404, JSON.stringify({ apiStatus: e.status }))
        }
    }

    @Response(404, 'NotFound')
    @SuccessResponse("200", "Retrieved")
    @Get("/rawplans/{customerId}")
    public async retrieveRawPlans(@Path() customerId: string) {
        logger.debug(`Consult plans for customerID=${customerId}`);
        try {
            const result: any = await this.hubService.retrievePlans(customerId, true)
            if (!result) {
                throw new ApiError("Nothing to show", 404, `Customer not found`)
            }
            logger.debug("customer request ended")
            return result
        } catch (e) {
            logger.error(e)
            throw new ApiError(`Error on retrieve rawplans for customer ${customerId}`, 404, JSON.stringify({ apiStatus: e.status }))
        }
    }

    @Response(404, 'NotFound')
    @SuccessResponse("200", "Retrieved")
    @Get("/plans/{customerId}/{orderId}/remove")
    public async removePlan(@Path() customerId: string, @Path() orderId: string) {
        const environment = process.env.DYNAMODB_ENV
        if (environment === 'prod') {
            return { RESULT: 'NOTHING TO SEE HERE' }
        }
        logger.debug(`Delte plan for customerId=${customerId} and orderId=${orderId}`);
        try {
            const result: any = await this.hubService.deleteOrderFromCustomer(customerId, orderId)
            if (!result) {
                throw new ApiError("Nothing to show", 404, `Customer not found`)
            }
            logger.debug("customer request ended")
            return result
        } catch (e) {
            throw new ApiError("Error on retrieve customer", 404, JSON.stringify({ apiStatus: e.status }))
        }
    }

    @Response(404, 'NotFound')
    @SuccessResponse("200", "Retrieved")
    @Get("/configs/{key}")
    public async retrieveConfigs(@Path() key: string) {
        logger.debug("Consult configs");
        if("df385601-8fd1-49f4-a367-8904620ec72b" === key) {
            return await this.hubService.retrieveConfigs()
        }
        return {}
    }

    @Response(404, 'NotFound')
    @SuccessResponse("200", "Retrieved")
    @Get("/tables/{key}")
    public async checkTables(@Path() key: string) {
        logger.debug("Checking Tables");
        if("8ddb6c11-df20-4b5a-a82d-40cd040c9cae" === key) {
            return await this.hubService.checkTable()
        }
        return {}
    }
}
