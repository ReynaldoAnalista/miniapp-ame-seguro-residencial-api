import Axios from "axios";
import { injectable, inject } from "inversify";
import { AxiosRepository } from "../repository/AxiosRepository";
import { RequestResponse } from "../model/RequestResponse";
import { getLogger } from "../../../server/Logger";

const logger = getLogger("AxiosService")

@injectable()
export class AxiosService {

    constructor(
        @inject("AxiosBigDataRepository")
        private axiosRepository: AxiosRepository
    ) { }

    /**
     * 
     * @param url 
     * @param options se passar __save = false nao grava no mongo
     * @param user 
     */
    get(url: string, options: any, user?: any) {
        if (options.__save === false) {
            let opts = {...options}
            delete opts.__save
            return Axios.get(url, opts)
        }
        // cria o registro da requisicao assincronamente
        // para nao impactar o tempo do request real
        let axiosCreatePromise = this.createReqRes('GET', url, undefined, options, user)

        let start = Date.now()
        let axiosPromise = Axios.get(url, options)

        this.updateResponse(axiosPromise, axiosCreatePromise, start)

        return axiosPromise
    }

    post(url: string, data: any, options: any, user?: any) {
        // cria o registro da requisicao assincronamente
        // para nao impactar o tempo do request real
        let axiosCreatePromise = this.createReqRes('POST', url, data, options, user)
        let start = Date.now()
        let axiosPromise = Axios.post(url, data, options)

        this.updateResponse(axiosPromise, axiosCreatePromise, start)

        return axiosPromise
    }

    put(url: string, data: any, options: any, user?: any) {
        // cria o registro da requisicao assincronamente
        // para nao impactar o tempo do request real
        let axiosCreatePromise = this.createReqRes('PUT', url, data, options, user)
        let start = Date.now()
        let axiosPromise = Axios.put(url, data, options)

        this.updateResponse(axiosPromise, axiosCreatePromise, start)

        return axiosPromise
    }

    patch(url: string, data: any, options: any, user?: any) {
        // cria o registro da requisicao assincronamente
        // para nao impactar o tempo do request real
        let axiosCreatePromise = this.createReqRes('PATCH', url, data, options, user)
        let start = Date.now()
        let axiosPromise = Axios.patch(url, data, options)

        this.updateResponse(axiosPromise, axiosCreatePromise, start)

        return axiosPromise
    }

    delete(url: string, options: any, user?: any) {
        // cria o registro da requisicao assincronamente
        // para nao impactar o tempo do request real
        let axiosCreatePromise = this.createReqRes('DELETE', url, undefined, options, user)
        let start = Date.now()
        let axiosPromise = Axios.delete(url, options)

        this.updateResponse(axiosPromise, axiosCreatePromise, start)

        return axiosPromise
    }

    private updateResponse(axiosPromise, axiosCreatePromise, start) {
        // atualiza assincronamente o resultado da requisicao
        // pra nao impactar tempo do request real
        axiosPromise.then(res => {
            this.successHandler(res, axiosCreatePromise, start)
        }).catch(err => {
            this.errorHandler(err, axiosCreatePromise, start)
        })
    }

    private async successHandler(res, axiosCreatePromise, start) {
        try {
            let request = await axiosCreatePromise
            request.timeMs = Date.now() - start
            request.response = {
                status: res.status,
                data: res.data
            }
            logger.info("Requisicao com sucesso", request.url)
            await this.axiosRepository.updateRequest(request)
        } catch (e) {
            logger.error("Erro ao atualizar/criar request", e.message)
        }
    }

    private async errorHandler(err, axiosCreatePromise, start) {
        try {
            let request: RequestResponse = await axiosCreatePromise
            request.timeMs = Date.now() - start
            if (err.response) {
                request.response = {
                    status: err.response.status,
                    data: err.response.data
                }
            }
            logger.warn("Erro na api do parceiro", request.url)
            await this.axiosRepository.updateRequest(request)
        } catch (e) {
            logger.error("Erro ao atualizar/criar request", e.message)
        }
    }

    /**
     * Guardando somente os parametros de query string do options
     * @param url 
     * @param data 
     * @param options 
     * @param user Usuario final da Ame que esta praticando a requisicao
     */
    private async createReqRes(method: string, url: string, data: any, options: any, user: any) {
        let sanitizedOptions = {
            params: options.params
        }
        let reqRes = RequestResponse.build(method, url, data, sanitizedOptions, user)
        return this.axiosRepository.createRequest(reqRes)
    }
}