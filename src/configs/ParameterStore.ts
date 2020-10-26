import "reflect-metadata"
import { injectable } from "inversify";
import { getLogger } from "../server/Logger";

const logger = getLogger("ParameterStore")

let paramsPromise

// PARAMETER_STORE deprecated
let configJsonOnEnv = process.env.SF_CONF || process.env.PARAMETER_STORE

if (configJsonOnEnv) {
    // na Ame o Wendell esta colocando o json de config em uma variavel de ambiente
    try {
        paramsPromise = Promise.resolve(JSON.parse(configJsonOnEnv))
    } catch (e) {
        console.log('Erro ao ler a variavel de ambiente SF_CONF\nO valor deve conter um json valido\n', e.message)
    }
} else {
    console.log(`Sem a variavel de ambiente SF_CONF, lendo configuracao do Parameter Store...`)
    const AWS = require('aws-sdk')

    AWS.config.update({
        region: 'us-east-1'
    })

    const PARAMETER_STORE_NAME = `${process.env.APPLICATION_NAME}-${process.env.NODE_ENV}`

    console.log("PARAMETER_STORE_NAME", PARAMETER_STORE_NAME)
    const parameterStore = new AWS.SSM()
    paramsPromise = new Promise((resolve, reject) => {
        parameterStore.getParameter({
            Name: PARAMETER_STORE_NAME,
            WithDecryption: true
        }, (err, data) => {
            if (err) {
                //return reject(err)
                logger.warn(`PARAMETER_STORE_NAME ${PARAMETER_STORE_NAME} nao foi encontrado`)
                return resolve()
            }
            return resolve(JSON.parse(data.Parameter.Value))
        })
    })
}
@injectable()
export class ParameterStore {
    async getSecretValue(key: string) {
        let map: any = await paramsPromise
        return map[key]
    }
}
