
export const getLogger = (logName) => {
    const pkg = require("../../package.json")
    const debug = require('debug')(`${pkg.name}:${logName}:debug`)
    const info = require('debug')(`${pkg.name}:${logName}:info`)
    const warn = require('debug')(`${pkg.name}:${logName}:warn`)
    const error = require('debug')(`${pkg.name}:${logName}:error`)

    return {
        debug, info, warn, error
    } as Logger
}

interface Logger {
    debug(...args: any[])
    info(...args: any[])
    warn(...args: any[])
    error(...args: any[])
}