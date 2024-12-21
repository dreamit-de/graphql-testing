import {
    requestForQuery,
    StandaloneGraphQLServerResponse,
    userQuery,
} from 'src'
import { expect, test } from 'vitest'

test('StandaloneGraphQLServerResponse should work as expected', () => {
    const response = new StandaloneGraphQLServerResponse()
    expect(response.statusCode).toBe(400)
    expect(response.headers).toStrictEqual(
        new Map<string, string | number | readonly string[]>(),
    )
    expect(response.responses).toStrictEqual([])

    // setHeader function
    response.setHeader('content-type', 'application/json')
    expect(response.headers.get('content-type')).toBe('application/json')

    // removeHeader function
    response.removeHeader('content-type')
    expect(response.headers.get('content-type')).toBeUndefined()

    // getLastResponse function with empty response
    expect(response.getLastResponse()).toBe(undefined)

    // getLastResponseAsObject function with empty response
    expect(response.getLastResponseAsObject()).toStrictEqual({})

    // Add string to the responses
    response.end('Hello, World!')
    expect(response.getLastResponse()).toBe('Hello, World!')
    expect(response.getLastResponseAsObject()).toBe('Hello, World!')

    // Add an object to the responses
    const userServerRequest = requestForQuery(userQuery)
    response.end(userServerRequest)
    expect(response.getLastResponse()).toBe(JSON.stringify(userServerRequest))
    expect(response.getLastResponseAsObject()).toStrictEqual(userServerRequest)

    // Add a Buffer to the responses
    const buffer = Buffer.from('Hello, World!', 'utf8')
    response.end(buffer)
    expect(response.getLastResponse()).toBe('Hello, World!')
    expect(response.getLastResponseAsObject()).toStrictEqual({})
})
