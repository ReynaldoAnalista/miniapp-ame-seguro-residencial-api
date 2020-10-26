import {inject, injectable} from "inversify";
import {getLogger} from "../../../server/Logger";
import {TYPES} from "../../../inversify/inversify.types";
import {ParameterStore} from "../../../configs/ParameterStore";
import axios from "axios";

import {AuthToken} from "../model/AuthToken";

const AWS = require('aws-sdk')
const log = getLogger("AuthTokenService")

AWS.config.update({
    region: 'us-east-1'
})

@injectable()
export class AuthTokenService {

    constructor(
        @inject(TYPES.ParameterStore)
        private parameterStore: ParameterStore,
    ) {
    }

    async retrieveAuthorization(): Promise<string | undefined> {

        log.debug('AuthTokenService: retrieveAuthorization')

        try{

            const authorization = Buffer.from(`${await this.retrieveClientId()}:${await this.retrieveClientSecret()}`, 'utf8').toString('base64')
            let config ={
                headers:    {
                    'Authorization': `Basic ${authorization}`,
                    "Content-Type":"application/json"
                }};

            let body = {
                        "customerId" : await this.retrieveCustomerId(),
                        "customerSiteId" : await this.retrieveCustomerSiteId()
            };

            log.debug('retrieveAuthorization')

            let result = new AuthToken();
            let url = await this.parameterStore.getSecretValue('URL')

             await axios.post(`${url}distributor-authorizations`,body,config)
                    .then((res) => {
                        console.log("RESPONSE RECEIVED: ", res.data);
                        result = res.data;
                    })
                    .catch((err) => {
                        console.log("AXIOS ERROR: ", err);
                    });

            return result.token;
        }catch(err){
            return 'Erro ao tentar buscar um token para autenticação';
        }
    }

    async retrieveClientId() {

        let clientId = process.env.CLIENT_ID || await this.parameterStore.getSecretValue('CLIENT_ID');

        if (!clientId) {
            clientId = process.env.AWS_ACCESS_KEY_ID;
        }
        return clientId
    }
    async retrieveClientSecret() {
        let client_secret = process.env.CLIENT_SECRET || await this.parameterStore.getSecretValue('CLIENT_SECRET')
        if (!client_secret) {
            client_secret = process.env.AWS_SECRET_ACCESS_KEY;
        }

        return client_secret;
    }

    async retrieveCustomerId() {

        let customerId = process.env.CUSTOMER_ID || await this.parameterStore.getSecretValue('CUSTOMER_ID');

        if (!customerId) {
            log.debug('Ocorreu um erro ao tentar acessar o CUSTOMER_ID')
            return Promise.resolve({})
        }
        return customerId
    }

    async retrieveCustomerSiteId() {

        let customerSiteId = process.env.CUSTOMER_SITE_ID || await this.parameterStore.getSecretValue('CUSTOMER_SITE_ID');

        if (!customerSiteId) {
            log.debug('Ocorreu um erro ao tentar acessar o CUSTOMER_SITE_ID')
            return Promise.resolve({})
        }
        return customerSiteId
    }
}
