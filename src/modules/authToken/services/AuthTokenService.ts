import {inject, injectable} from "inversify";
import {getLogger} from "../../../server/Logger";
import {TYPES} from "../../../inversify/inversify.types";
import {ParameterStore} from "../../../configs/ParameterStore";
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
        @inject(TYPES.ParameterStore) private parameterStore: ParameterStore
    ) {
    }

    private async retrieveConfig(configName: string): Promise<String> {
        log.debug(`Searching for config: ${configName}`)
        if (configName) {
            try {
                const configValue = await this.parameterStore.getSecretValue(configName)
                if (!configValue) {
                    log.debug("There is no value to this config")
                }
                log.debug(`Success for config: ${configName}`)
                return configValue
            } catch (err) {
                log.error("Take error on trying to retrieve config")
                throw err
            }
        }
        log.error("Retrieving config with no configName")
        throw "Retrieving config with no configName"
    }

    async retrieveAuthorization(): Promise<string | undefined> {
        log.debug('Starting Authorization')
        try {
            let clientId = await this.retrieveConfig('CLIENT_ID')
            let clientSecret = await this.retrieveConfig('CLIENT_SECRET')
            let clientScope = await this.retrieveConfig('CLIENT_SCOPE')
            const authorization = Buffer.from(`${clientId}:${clientSecret}`, 'utf8').toString('base64')
            let config = {
                headers: {
                    'Authorization': `Basic ${authorization}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };
            let body = qs.stringify({
                'grant_type': 'client_credentials',
                'scope': clientScope
            })
            log.debug('Trying to authorizate')
            let result: AuthToken = new AuthToken();
            let url = await this.parameterStore.getSecretValue('URL_AUTHORIZATION')
            await axios.post(url, body, config)
                .then((res) => {
                    log.debug("AUTHORIZED");
                    result = AuthToken.fromObject(res.data);
                })
                .catch((err) => {
                    log.error("ERROR ON AUTHORIZING");
                    log.error("AXIOS ERROR: ", err);
                });
            return result.access_token;
        } catch (err) {
            return 'Erro ao tentar buscar um token para autenticação';
        }
    }
}
