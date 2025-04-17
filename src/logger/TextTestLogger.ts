import { DateFunction, testDateString } from '@dreamit/funpara'
import { LogEntry, LogEntryInput, Logger } from '@dreamit/graphql-server-base'

/**
 * Logger implementation that saves created log entries in a string array.
 */
export class TextTestLogger implements Logger {
    loggerName = 'test-logger'
    debugEnabled: boolean
    serviceName = 'myTestService'
    logEntries: string[] = []

    constructor(debugEnabled = false) {
        this.debugEnabled = debugEnabled
    }

    debug(
        logMessage: string,
        context?: unknown,
        dateFunction?: DateFunction,
    ): void {
        if (this.debugEnabled) {
            this.createLogEntry({
                context,
                dateFunction,
                logMessage,
                loglevel: 'DEBUG',
            })
        }
    }

    error(
        logMessage: string,
        error: Error,
        customErrorName: string,
        context?: unknown,
        dateFunction?: DateFunction,
    ): void {
        this.createLogEntry({
            context,
            customErrorName,
            dateFunction,
            error,
            logMessage,
            loglevel: 'ERROR',
        })
    }

    info(
        logMessage: string,
        context?: unknown,
        dateFunction?: DateFunction,
    ): void {
        this.createLogEntry({
            context,
            dateFunction,
            logMessage,
            loglevel: 'INFO',
        })
    }

    warn(
        logMessage: string,
        context?: unknown,
        dateFunction?: DateFunction,
    ): void {
        this.createLogEntry({
            context,
            dateFunction,
            logMessage,
            loglevel: 'WARN',
        })
    }

    createLogEntry(logEntryInput: LogEntryInput): void {
        const logEntry: LogEntry = {
            errorName: logEntryInput.customErrorName,
            level: logEntryInput.loglevel ?? 'INFO',
            logger: this.loggerName,
            message: logEntryInput.logMessage,
            serviceName: this.serviceName,
            stacktrace: logEntryInput.error?.stack ? 'stacktrace' : undefined,
            timestamp: testDateString,
        }
        this.logEntries.push(
            `${logEntry.timestamp} [${logEntry.level.toUpperCase()}]` +
                `${this.loggerName}-${this.serviceName} :` +
                logEntry.message +
                (logEntry.stacktrace ? ` ${logEntry.stacktrace}` : ''),
        )
    }
}
