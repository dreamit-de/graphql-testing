import { testDateString } from '@dreamit/funpara'
// eslint-disable-next-line @typescript-eslint/no-duplicate-imports
import type { DateFunction } from '@dreamit/funpara'
import type {
    LogEntry,
    LogEntryInput,
    Logger,
} from '@dreamit/graphql-server-base'

/**
 * Logger implementation that saves created log entries in an LogEntry array.
 */
export class JsonTestLogger implements Logger {
    loggerName = 'test-logger'
    debugEnabled: boolean
    serviceName = 'myTestService'
    logEntries: LogEntry[] = new Array<LogEntry>()

    constructor(debugEnabled = false) {
        this.debugEnabled = debugEnabled
    }

    debug(
        logMessage: string,
        context: Record<string, unknown>,
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
        context: Record<string, unknown>,
        error: Error,
        customErrorName: string,
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
        context: Record<string, unknown>,
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
        context: Record<string, unknown>,
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
        this.logEntries.push(logEntry)
    }
}
