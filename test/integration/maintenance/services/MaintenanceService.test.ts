import path from "path"
import util from "util"
import fs from "fs"
import jwt from "jsonwebtoken"
import { v4 as uuidv4 } from "uuid"
import { initDependencies, iocContainer } from "../../../../src/inversify/inversify.config"
import { MaintenanceService } from "../../../../src/modules/maintenance/services/MaintenanceService"
import { ParameterStore } from "../../../../src/configs/ParameterStore"
import { getLogger } from "../../../../src/server/Logger"

const log = getLogger("PetProposalService:test")
const readFile = util.promisify(fs.readFile)
const sign = util.promisify(jwt.sign)

initDependencies()
jest.setTimeout(20000)

let maintenanceService: MaintenanceService
describe("MaintenanceService", () => {
    let parameterStore: ParameterStore
    let signedNotification: any

    beforeAll(async () => {
        maintenanceService = iocContainer.get("MaintenanceService")
        parameterStore = iocContainer.get("ParameterStore")
        const notification = await readFile(path.resolve(__dirname, "../../../fixtures/UpdatePlanTypeNotification.json"), "utf-8")
        log.debug("Leu o arquivo de callback")
        const secret = await parameterStore.getSecretValue("CALINDRA_JWT_SECRET")
        log.debug("Buscou o secret na AWS")
        const notificationObject = Object()
        notificationObject.attributes = JSON.parse(notification)
        log.debug("Realizou o parse do arquivo de callback")
        signedNotification = await sign(notificationObject, secret)
    })

    it("Envio da requisição de Mudança de Status", async () => {
        const maintenance = await maintenanceService.updateOrdersType(signedNotification)
        expect(maintenance.success).toBe(true)
    })
})
