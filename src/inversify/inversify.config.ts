import 'reflect-metadata'
import {Container} from 'inversify'
import {AppConfig} from '../configs/AppConfig';
import {TYPES} from './inversify.types';
import {BlindGuardianConfig} from '../configs/BlindGuardianConfig';
import {ApiServer} from '../server/ApiServer';
import {ServerConfig} from '../configs/ServerConfig';
import Axios, {AxiosInstance} from 'axios';
import {ParameterStore} from "../configs/ParameterStore";
import {Secrets} from "../configs/Secrets";
import { DynamoHolder } from '../repository/DynamoHolder';
import { MailSender } from '../modules/default/services/MailSender';
import { MailAwsService } from '../modules/default/services/MailAwsService';

export const iocContainer = new Container()

export const initDependencies = () => {
    const axios = Axios.create({})

    iocContainer.bind<MailSender>("MailSender").to(MailAwsService).inSingletonScope()

    /* Initialize Configs */
    iocContainer.bind<AppConfig>(TYPES.AppConfig).to(AppConfig).inSingletonScope();
    iocContainer.bind<BlindGuardianConfig>(TYPES.BlindGuardianConfig).to(BlindGuardianConfig).inSingletonScope()
    iocContainer.bind<ServerConfig>(TYPES.ServerConfig).to(ServerConfig).inSingletonScope()
    iocContainer.bind<ParameterStore>(TYPES.ParameterStore).to(ParameterStore).inSingletonScope()
    iocContainer.bind<Secrets>(TYPES.Secrets).to(Secrets).inSingletonScope()
    iocContainer.bind(TYPES.DynamoHolder).to(DynamoHolder).inSingletonScope()

    /* Initialize Clients */
    iocContainer.bind<AxiosInstance>(TYPES.AxiosInstance).toConstantValue(axios)

    /* Initialize Controllers */
    bindControllers("../modules/default/controllers")
    bindControllers("../modules/authToken/controllers")
    bindControllers("../modules/hub/controllers")
    bindControllers("../modules/residentialProposal/controllers")
    bindControllers("../modules/smartphoneProposal/controllers")
    // bindControllers("../modules/unusual/controllers")

    /* Initialize Services */
    iocContainer.bind<ApiServer>(TYPES.ApiServer).to(ApiServer).inSingletonScope()
    bindSingleton("../modules/default/services")
    bindSingleton("../modules/authToken/services")
    bindSingleton("../modules/hub/services")
    bindSingleton("../modules/residentialProposal/services")
    bindSingleton("../modules/smartphoneProposal/services")
    // bindSingleton("../modules/unusual/services")

/* Initialize Repositories */
    bindSingleton("../modules/hub/repository")
    bindSingleton("../modules/residentialProposal/repository")
    bindSingleton("../modules/smartphoneProposal/repository")
    // bindSingleton("../modules/unusual/repository")
    //bindSingleton("../modules/voucher/repository")
}

function requireDir(relativePath: string): any[] {
    const fs = require('fs')
    const path = require('path')
    let fullPath = path.join(__dirname, relativePath)
    return fs.readdirSync(fullPath).map(fileName => {
        let withoutExtension = fileName.replace(/\.(ts|js)$/, '')
        let servicePath = `${relativePath}/${withoutExtension}`
        return require(servicePath)
    })
}

function bindControllers(relativePath: string) {
    requireDir(relativePath).forEach(definitions => {
        for (let identifier in definitions) {
            let clazz = definitions[identifier]
            if (identifier.endsWith("Controller")) {
                iocContainer.bind(clazz).to(clazz).inSingletonScope()
            }
        }
    })
}

function bindSingleton(relativePath: string) {
    requireDir(relativePath).forEach(servicesDefinitions => {
        for (let serviceIdentifier in servicesDefinitions) {
            let clazz = servicesDefinitions[serviceIdentifier]
            iocContainer.bind(serviceIdentifier).to(clazz).inSingletonScope()
        }
    })
}
