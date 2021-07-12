export class ApiError extends Error {
    public statusCode: number
    public errors: any
    constructor(name: string, statusCode: number, message?: string, errors?: any) {
        super(message)
        this.name = name
        this.statusCode = statusCode
        this.errors = errors
    }
}
