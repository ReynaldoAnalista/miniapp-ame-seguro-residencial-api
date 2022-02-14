import "./tracer"
import "reflect-metadata"
import { ApiServer } from "./server/ApiServer"
import { initDependencies, iocContainer } from "./inversify/inversify.config"
import { TYPES } from "./inversify/inversify.types"
import { lifeCronService } from "./modules/lifeProposal/services/lifeCronService"
import { getLogger } from "./server/Logger"

const log = getLogger("AppStartServer")

initDependencies()

const apiServer = iocContainer.get<ApiServer>(TYPES.ApiServer)

apiServer.start()
startCronJobs()

function startCronJobs() {
    if (process.env.NODE_ENV === "test" || process.env.NODE_ENV === "development") {
        return
    }
    try {
        const lifeCronService = iocContainer.get<lifeCronService>(TYPES.lifeCronService)
        lifeCronService.startCronJobs()
    } catch (e) {
        log.error("lifeCronService.startCronJobs.error", e)
    }
}
