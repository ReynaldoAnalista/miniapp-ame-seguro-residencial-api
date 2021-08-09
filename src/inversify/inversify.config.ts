import "reflect-metadata"
import { Container } from "inversify"
import { AppConfig } from "../configs/AppConfig"
import { TYPES } from "./inversify.types"
import { BlindGuardianConfig } from "../configs/BlindGuardianConfig"
import { ApiServer } from "../server/ApiServer"
import { ServerConfig } from "../configs/ServerConfig"
import Axios, { AxiosInstance } from "axios"
import { ParameterStore } from "../configs/ParameterStore"
import { Secrets } from "../configs/Secrets"
import { DynamoHolder } from "../repository/DynamoHolder"
import { MailSender } from "../modules/default/services/MailSender"
import { MailAwsService } from "../modules/default/services/MailAwsService"

export const iocContainer = new Container()

export const initDependencies = () => {
    const axios = Axios.create({})

    iocContainer.bind<MailSender>("MailSender").to(MailAwsService).inSingletonScope()

    /* Initialize Configs */
    iocContainer.bind<AppConfig>(TYPES.AppConfig).to(AppConfig).inSingletonScope()
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
    bindControllers("../modules/petProposal/controllers")
    bindControllers("../modules/lifeProposal/controllers")
    bindControllers("../modules/healthCareProposal/controllers")
    bindControllers("../modules/maintenance/controllers")

    /* Initialize Services */
    iocContainer.bind<ApiServer>(TYPES.ApiServer).to(ApiServer).inSingletonScope()
    bindSingleton("../modules/default/services")
    bindSingleton("../modules/authToken/services")
    bindSingleton("../modules/hub/services")
    bindSingleton("../modules/residentialProposal/services")
    bindSingleton("../modules/smartphoneProposal/services")
    bindSingleton("../modules/maintenance/services")
    bindSingleton("../modules/petProposal/services")
    bindSingleton("../modules/lifeProposal/services")

    /* Initialize Repositories */
    bindSingleton("../modules/hub/repository")
    bindSingleton("../modules/residentialProposal/repository")
    bindSingleton("../modules/smartphoneProposal/repository")
    bindSingleton("../modules/petProposal/repository")
    bindSingleton("../modules/healthCareProposal/repository")
    bindSingleton("../modules/maintenance/repository")
    //bindSingleton("../modules/voucher/repository")
}

function requireDir(relativePath: string): any[] {
    const fs = require("fs")
    const path = require("path")
    const fullPath = path.join(__dirname, relativePath)
    return fs.readdirSync(fullPath).map((fileName) => {
        const withoutExtension = fileName.replace(/\.(ts|js)$/, "")
        const servicePath = `${relativePath}/${withoutExtension}`
        return require(servicePath)
    })
}

function bindControllers(relativePath: string) {
    requireDir(relativePath).forEach((definitions) => {
        for (const identifier in definitions) {
            const clazz = definitions[identifier]
            if (identifier.endsWith("Controller")) {
                iocContainer.bind(clazz).to(clazz).inSingletonScope()
            }
        }
    })
}

function bindSingleton(relativePath: string) {
    requireDir(relativePath).forEach((servicesDefinitions) => {
        for (const serviceIdentifier in servicesDefinitions) {
            const clazz = servicesDefinitions[serviceIdentifier]
            iocContainer.bind(serviceIdentifier).to(clazz).inSingletonScope()
        }
    })
}
