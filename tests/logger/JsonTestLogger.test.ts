/* eslint-disable max-len */
import { testDateFunction } from '@dreamit/funpara'
import { JsonTestLogger } from 'src/logger/JsonTestLogger'
import { expect, test } from 'vitest'

test('Creating a Logger should work with default options', () => {
    const logger = new JsonTestLogger()
    expect(logger.debugEnabled).toBe(false)
    expect(logger.loggerName).toBe('test-logger')
    expect(logger.serviceName).toBe('myTestService')
})

test('Logging entry should work even if no loglevel is provided', () => {
    const logger = new JsonTestLogger()
    logger.createLogEntry({
        context: undefined,
        logMessage: 'test',
    })
    const logEntry = logger.logEntries.at(0)
    expect(logEntry?.message).toBe('test')
    expect(logEntry?.level).toBe('INFO')
})

test('Debug entry should be written if debug is enabled', () => {
    const debugLogger = new JsonTestLogger(true)
    debugLogger.debug('test', undefined, testDateFunction)
    const logEntry = debugLogger.logEntries.at(0)
    expect(logEntry?.message).toBe('test')
    expect(logEntry?.level).toBe('DEBUG')
})

test('Debug entry should not be written if debug is disabled', () => {
    const defaultLogger = new JsonTestLogger()
    defaultLogger.debug('test')
    expect(defaultLogger.logEntries.length).toBe(0)
})

test('Error entry should be written', () => {
    const defaultLogger = new JsonTestLogger()
    const testError = new Error('error')
    testError.stack = 'stacktrace'
    defaultLogger.error(
        'error',
        testError,
        'custom',
        undefined,
        testDateFunction,
    )
    const createdLogEntry = defaultLogger.logEntries.at(0)
    expect(createdLogEntry?.level).toBe('ERROR')
    expect(createdLogEntry?.message).toBe('error')
    expect(createdLogEntry?.errorName).toBe('custom')
    expect(createdLogEntry?.stacktrace).toBe('stacktrace')
})

test('Info entry should be written', () => {
    const defaultLogger = new JsonTestLogger()
    defaultLogger.info('info', undefined, testDateFunction)
    const createdLogEntry = defaultLogger.logEntries.at(0)
    expect(createdLogEntry?.level).toBe('INFO')
    expect(createdLogEntry?.message).toBe('info')
})

test('Warn entry should be written', () => {
    const defaultLogger = new JsonTestLogger()
    defaultLogger.warn('warn', undefined, testDateFunction)
    const createdLogEntry = defaultLogger.logEntries.at(0)
    expect(createdLogEntry?.level).toBe('WARN')
    expect(createdLogEntry?.message).toBe('warn')
})
