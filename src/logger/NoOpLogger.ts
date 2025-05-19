/* eslint-disable no-empty-function, no-unused-vars */
import type { DateFunction } from '@dreamit/funpara'
import type { Logger } from '@dreamit/graphql-server-base'

/**
 * Logger implementation that does not log or output anything.
 */
class NoOpLogger implements Logger {
    loggerName: string
    serviceName: string
    debugEnabled: boolean

    /**
     * Creates a new Logger instance.
     * @param {string} loggerName - The logger name of the logger.
     * @param {string} serviceName - The service name of the logger.
     */
    constructor(loggerName: string, serviceName: string) {
        this.loggerName = loggerName
        this.serviceName = serviceName
        this.debugEnabled = false
    }
    debug(
        logMessage: string,
        context: Record<string, unknown>,
        dateFunction?: DateFunction,
    ): void {}
    error(
        logMessage: string,
        context: Record<string, unknown>,
        error: Error,
        customErrorName?: string,
        dateFunction?: DateFunction,
    ): void {}
    info(
        logMessage: string,
        context: Record<string, unknown>,
        dateFunction?: DateFunction,
    ): void {}
    warn(
        logMessage: string,
        context: Record<string, unknown>,
        dateFunction?: DateFunction,
    ): void {}
}

const NoOpTestLogger = new NoOpLogger('no-logger', 'myTestService')

export { NoOpLogger, NoOpTestLogger }
