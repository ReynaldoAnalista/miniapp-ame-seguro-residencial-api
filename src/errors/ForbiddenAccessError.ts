import {GenericError} from "./GenericError";

export class ForbiddenAccessError extends GenericError {
    constructor(message: string) {
        super(403, message);
    }
}
