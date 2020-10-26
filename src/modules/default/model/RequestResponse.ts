
export class RequestResponse {

    _id: any

    method?:string

    url?: string

    timeMs?: number

    /**
     * End user, ou seja, usuario final da ame
     */
    user: any

    createdAt: string = new Date().toISOString()
    updatedAt?: string
    request: any
    response?: any

    static build(method: string, url: string, data: any, options: any, user: any): RequestResponse {
        let reqRes = new RequestResponse()
        reqRes.method = method
        reqRes.url = url
        reqRes.user = user
        reqRes.request = { options, data }
        return reqRes
    }
}