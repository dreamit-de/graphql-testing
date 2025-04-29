/* eslint-disable max-len */
import { testDateFunction, testDateString } from '@dreamit/funpara'
import { TextTestLogger } from 'src/logger/TextTestLogger'
import { expect, test } from 'vitest'

test('Creating a Logger should work with default options', () => {
    const logger = new TextTestLogger()
    expect(logger.debugEnabled).toBe(false)
    expect(logger.loggerName).toBe('test-logger')
    expect(logger.serviceName).toBe('myTestService')
})

test('Logging entry should work even if no loglevel is provided', () => {
    const logger = new TextTestLogger()
    logger.createLogEntry({
        context: {},
        logMessage: 'test',
    })
    // Then
    expect(logger.logEntries.at(0)).toBe(
        `${testDateString} [INFO]test-logger-myTestService :test`,
    )
})

test('Debug entry should be written if debug is enabled', () => {
    const debugLogger = new TextTestLogger(true)
    debugLogger.debug('test', {}, testDateFunction)
    expect(debugLogger.logEntries.at(0)).toBe(
        `${testDateString} [DEBUG]test-logger-myTestService :test`,
    )
})

test('Debug entry should not be written if debug is disabled', () => {
    const defaultLogger = new TextTestLogger()
    defaultLogger.debug('test', {})
    expect(defaultLogger.logEntries.length).toBe(0)
})

test('Error entry should be written', () => {
    const defaultLogger = new TextTestLogger()
    const testError = new Error('error')
    testError.stack = 'stacktrace'
    defaultLogger.error('error', {}, testError, 'custom', testDateFunction)
    expect(defaultLogger.logEntries.at(0)).toBe(
        '1001-01-01T00:00:00.000Z [ERROR]test-logger-myTestService :error stacktrace',
    )
})

test('Info entry should be written', () => {
    const defaultLogger = new TextTestLogger()
    defaultLogger.info('info', {}, testDateFunction)
    expect(defaultLogger.logEntries.at(0)).toBe(
        '1001-01-01T00:00:00.000Z [INFO]test-logger-myTestService :info',
    )
})

test('Warn entry should be written', () => {
    const defaultLogger = new TextTestLogger()
    defaultLogger.warn('warn', {}, testDateFunction)
    expect(defaultLogger.logEntries.at(0)).toBe(
        '1001-01-01T00:00:00.000Z [WARN]test-logger-myTestService :warn',
    )
})
