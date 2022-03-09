import express from "express"
import bodyParser from "body-parser"
import { inject, injectable, multiInject } from "inversify"
import { TYPES } from "../inversify/inversify.types"
import { ServerConfig } from "../configs/ServerConfig"
import { RegisterRoutes } from "../routes"
import { ApiError } from "../errors/ApiError"
import { getLogger } from "./Logger"

const swaggerUi = require("swagger-ui-express")
const swaggerDocument = require("../../docs/swagger.json")
const tsoaJson = require("../../tsoa.json")
const logger = getLogger("ApiServer")

@injectable()
export class ApiServer {
    private readonly app: any
    private nodeServer: any

    constructor(
        @inject(TYPES.ServerConfig)
        private readonly _config: ServerConfig
    ) {
        this.app = express()
    }

    public start = (): Promise<void> => {
        return new Promise(async (resolve, _reject) => {
            const packageJsonInfo = require("../../package.json")
            process.env.APPLICATION_NAME = `${packageJsonInfo.name}-${process.env.NODE_ENV}`

            const docPath = `${tsoaJson.routes.basePath}/api-docs`
            logger.debug("Documentacao em", docPath)
            this.app.disable("x-powered-by")
            this.app
                .use(bodyParser.urlencoded({ extended: true }))
                .use(bodyParser.json())
                .use(docPath, swaggerUi.serve, swaggerUi.setup(swaggerDocument, { explorer: true }))
                .use((_req, res, next) => {
                    next()
                })

            RegisterRoutes(this.app)

            this.app.use((err, req, res, _next) => {
                if (err instanceof ApiError) {
                    logger.warn({ type: "ApiError", method: req.method, url: req.originalUrl, stack: err.stack })
                    res.status(err.statusCode)
                    res.json({ name: err.name, message: err.message, errors: err.errors })
                } else if (err.code === "ResourceNotFoundException") {
                    logger.error({ type: "ResourceNotFound", method: req.method, url: req.originalUrl, stack: err.stack })
                    res.status(404)
                    res.json({})
                } else {
                    logger.error({ type: "UnexpectedError", method: req.method, url: req.originalUrl, stack: err.stack })
                    res.status(err.status || 500)
                    res.json(err || {})
                }
            })

            const port = process.env.PORT || this._config.port
            this.nodeServer = this.app.listen(port, () => {
                logger.info(`Server is up & running on port ${port}`)
                resolve()
            })
        })
    }

    public stop = (): Promise<void> => {
        return new Promise((resolve, _reject) => {
            this.nodeServer.close(() => {
                resolve()
            })
        })
    }
}
