export class GenericError {
    private httpStatusCode: number
    private message: string
    private error: string | undefined

    constructor(httpStatusCode: number, message: string, error?: string) {
        this.httpStatusCode = httpStatusCode
        this.message = message
        this.error = error
    }

    getHttpStatusCode = (): number => {
        return this.httpStatusCode
    }
}
