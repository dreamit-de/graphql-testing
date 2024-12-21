/* eslint-disable max-len */
import { NoConsole } from 'src'
import { expect, test } from 'vitest'

test('Using NoConsole log should not throw an error', () => {
    expect(() => NoConsole.log('123')).not.toThrowError()
})
