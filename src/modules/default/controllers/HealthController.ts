import {inject, injectable} from "inversify";
import {Get, Route} from "tsoa";
import {TYPES} from "../../../inversify/inversify.types";
import {ParameterStore} from "../../../configs/ParameterStore";

const fs = require('fs')
const path = require('path')

@Route('/health')
@injectable()
export class HealthController {
    private startupDate: Date

    constructor(
        @inject(TYPES.ParameterStore)
        private parameterStore: ParameterStore
    ) {
        this.startupDate = new Date()
    }

    @Get()
    public async health() {
        return {
            'message': 'I am Healthy',
            'startup': this.startupDate,
            'commitDate': await this.getCommitDate(),
            'commitHash': process.env.COMMIT_HASH || "unavailable"
        }
    }

    @Get('/test')
    public async test() {
        return {
            CLIENT_ID: await this.parameterStore.getSecretValue('CLIENT_ID'),
            CLIENT_SECRET: await this.parameterStore.getSecretValue('CLIENT_SECRET'),
            CLIENT_SCOPE: await this.parameterStore.getSecretValue('CLIENT_SCOPE'),
            URL_AUTHORIZATION: await this.parameterStore.getSecretValue('URL_AUTHORIZATION'),
            URL_ZIPCODE: await this.parameterStore.getSecretValue('URL_ZIPCODE'),
            URL_PLANS: await this.parameterStore.getSecretValue('URL_PLANS'),
            URL_SALE: await this.parameterStore.getSecretValue('URL_SALE'),
            CONTRACT_NUMBER: await this.parameterStore.getSecretValue('CONTRACT_NUMBER'),
            BROKER_NUMBER: await this.parameterStore.getSecretValue('BROKER_NUMBER'),
            AME_COMISSION: await this.parameterStore.getSecretValue('AME_COMISSION'),
            BROKER_COMISSION: await this.parameterStore.getSecretValue('BROKER_COMISSION'),
            CALINDRA_JWT_SECRET: await this.parameterStore.getSecretValue('CALINDRA_JWT_SECRET')
        }
    }

    /**
     * Para automatizar a verificacao de build velho
     * rodando nos ambientes
     */
    private getCommitDate() {
        return new Promise((resolve, reject) => {
            try {
                let commitDateFile = path.join(__dirname, "../../../commit_date.txt")
                fs.readFile(commitDateFile, 'utf-8', (err, data) => {
                    if (err) {
                        return resolve("2001-01-01")
                    }
                    resolve(data.trim())
                })
            } catch (e) {
                resolve("2001-01-01")
            }
        })
    }

}
