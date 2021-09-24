import "./tracer" // must come before importing any instrumented module.
import "reflect-metadata"
import { ApiServer } from "./server/ApiServer"
import { initDependencies, iocContainer } from "./inversify/inversify.config"
import { TYPES } from "./inversify/inversify.types"

initDependencies()

const apiServer = iocContainer.get<ApiServer>(TYPES.ApiServer)

apiServer.start()
