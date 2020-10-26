import {GenericError} from "./GenericError";

export class IntegrationError extends GenericError {

    constructor(httpStatusCode: number, message: string, err?: any) {
        super(httpStatusCode, message, err)
    }
}
