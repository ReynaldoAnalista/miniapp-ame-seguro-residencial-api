import { GenericError } from "./GenericError"

export class MissingRequiredParams extends GenericError {
    constructor(message: string, error?: string, httpStatusCode?: number) {
        if (httpStatusCode) {
            super(httpStatusCode, message, error)
        } else {
            super(422, message, error)
        }
    }
}