import {inject, injectable} from "inversify"
import {PriceService} from "../services/PriceService"
import {Get, Path, Route, SuccessResponse, Response} from "tsoa"
import {getLogger} from "../../../server/Logger"
import { ApiError } from "../../../errors/ApiError";

const logger = getLogger("PriceController")
@Route('/v1/prices')
@injectable()
export class PriceController {
    constructor(
        @inject("PriceService") private priceService: PriceService,
    ) {
    }

    /**
     * Busca lista de preços por coordenadas(Longitude e latitude)
     * @param coords
     */
    @Response(404,'NotFound')
    @SuccessResponse("200","Retrieved")
    @Get("/retrieve/{long}/{lat}")
    public async retrievePrice( @Path() long:string, @Path() lat:string) {
        logger.debug('PriceController: retrievePrice');

        let result: any = await this.priceService.retrievePrices(long, lat);

        if(result.length === 0) {
            throw new ApiError("Price not found", 404, `Price not found lat[${lat}] lng[${long}]`)
        }

        return Promise.resolve(result)

    }


}
