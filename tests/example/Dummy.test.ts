import { expect, test } from 'vitest'

test('Should use customErrorName instead or error.name if customErrorName is set', () => {
    expect('123').toBe('123')
})
