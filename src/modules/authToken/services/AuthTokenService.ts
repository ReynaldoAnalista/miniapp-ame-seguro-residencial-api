import {inject, injectable} from "inversify";
import {getLogger} from "../../../server/Logger";
import {TYPES} from "../../../inversify/inversify.types";
import {Secrets} from "../../../configs/Secrets";
import axios from "axios";
import qs from 'qs'

import {AuthToken} from "../model/AuthToken";

const AWS = require('aws-sdk')
const log = getLogger("AuthTokenService")

AWS.config.update({
    region: 'us-east-1'
})

@injectable()
export class AuthTokenService {

    constructor(
        @inject(TYPES.Secrets)
        private secrets: Secrets,
    ) {
    }

    async retrieveConfig(configName:string) : Promise<String> {
        if(!configName) {
            try {
                const configValue = await this.secrets.get(configName)
                if(!configValue) {
                    log.debug("There is no value to this config")
                }
                return configValue
            } catch( err ) {
                log.error("Take error on trying to retrieve config")
                log.error(err)
            }
        }
        log.error("Retrieving config with no configName")
        throw "Retrieving config with no configName"
    }

    async retrieveAuthorization(): Promise<string | undefined> {
        log.debug('AuthTokenService: retrieveAuthorization')
        try{
            let clientId = await this.retrieveConfig('CLIENT_ID')
            let clientSecret = await this.retrieveConfig('CLIENT_SECRET')
            let clientScope = await this.retrieveConfig('CLIENT_SCOPE')
            const authorization = Buffer.from(`${clientId}:${clientSecret}`, 'utf8').toString('base64')
            let config ={
                headers:    {
                    'Authorization': `Basic ${authorization}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };
            let body = qs.stringify({
                'grant_type': 'client_credentials',
                'scope': clientScope
            })
            log.debug('retrieveAuthorization')
            let result:AuthToken = new AuthToken();
            let url = await this.secrets.get('URL')
             await axios.post(`${url}distributor-authorizations`,body,config)
                    .then((res) => {
                        console.log("RESPONSE RECEIVED: ", res.data);
                        result = AuthToken.fromObject(res.data);
                    })
                    .catch((err) => {
                        console.log("AXIOS ERROR: ", err);
                    });
            return result.access_token;
        }catch(err){
            return 'Erro ao tentar buscar um token para autenticação';
        }
    }
}
