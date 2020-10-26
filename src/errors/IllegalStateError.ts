import {GenericError} from "./GenericError";

export class IllegalStateError extends GenericError {
    constructor(message: string, error?: string, httpStatusCode?: number) {
        if (httpStatusCode) {
            super(httpStatusCode, message, error)
        } else {
            super(400, message, error)
        }
    }
}