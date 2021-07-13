import { RequestResponse } from "../model/RequestResponse"

export interface AxiosRepository {
    updateRequest(request: RequestResponse): Promise<RequestResponse>

    createRequest(request: RequestResponse): Promise<RequestResponse>
}
