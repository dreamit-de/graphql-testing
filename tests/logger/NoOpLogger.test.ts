/* eslint-disable max-len */
import { NoOpLogger } from 'src/logger/NoOpLogger'
import { expect, test } from 'vitest'

test('Should be able to use NoLogger without running into errors', () => {
    const logger = new NoOpLogger('no-logger', 'no-service')
    expect(logger.debugEnabled).toBe(false)
    const testMessage = 'Test message'

    // Then
    expect(() => logger.debug(testMessage, {})).not.toThrowError()
    expect(() =>
        logger.error(testMessage, {}, new Error(testMessage)),
    ).not.toThrowError()
    expect(() => logger.info(testMessage, {})).not.toThrowError()
    expect(() => logger.warn(testMessage, {})).not.toThrowError()
})
