import {
    requestForQuery,
    StandaloneGraphQLServerResponse,
    userQuery,
} from 'src'
import { expect, test } from 'vitest'

const exampleText = 'Hello, World!'
const exampleTextTwo = 'Hello, World 2nd!'
const exampleJSON = '{"AKey":"AValue"}'

test('StandaloneGraphQLServerResponse should work as expected', () => {
    const response = new StandaloneGraphQLServerResponse()
    expect(response.statusCode).toBe(400)
    expect(response.headers).toStrictEqual(
        new Map<string, string | number | readonly string[]>(),
    )
    expect(response.responses).toStrictEqual([])

    // setHeader and header function
    response.setHeader('content-type', 'application/text')
    expect(response.headers.get('content-type')).toBe('application/text')
    response.header('content-type', 'application/json')
    expect(response.headers.get('content-type')).toBe('application/json')

    // removeHeader function
    response.removeHeader('content-type')
    expect(response.headers.get('content-type')).toBeUndefined()

    // getLastResponse function with empty response
    expect(response.getLastResponse()).toBe(undefined)

    // getLastResponseAsObject function with empty response
    expect(response.getLastResponseAsObject()).toBeUndefined()
    expect(response.getLastResponseAsObject(false)).toBeUndefined()

    // Add string to the responses
    response.end(exampleText)
    expect(response.getLastResponse()).toBe(exampleText)
    expect(response.getLastResponseAsObject()).toBe(exampleText)
    expect(response.getLastResponseAsObject(false)).toBe(exampleText)
    response.send(exampleTextTwo)
    expect(response.getLastResponse()).toBe(exampleTextTwo)
    expect(response.getLastResponseAsObject()).toBe(exampleTextTwo)
    expect(response.getLastResponseAsObject(false)).toBe(exampleTextTwo)

    // Add JSON string to the responses
    response.end(exampleJSON)
    expect(response.getLastResponse()).toBe(exampleJSON)
    expect(response.getLastResponseAsObject().AKey).toBe('AValue')
    expect(response.getLastResponseAsObject(false)).toBe(exampleJSON)

    // Add an object to the responses
    const userServerRequest = requestForQuery(userQuery)
    response.end(userServerRequest)
    expect(response.getLastResponse()).toBe(JSON.stringify(userServerRequest))
    expect(response.getLastResponseAsObject()).toStrictEqual(userServerRequest)
    expect(response.getLastResponseAsObject(false)).toStrictEqual(
        userServerRequest,
    )

    // Add a Buffer to the responses
    let buffer = Buffer.from(exampleText, 'utf8')
    response.end(buffer)
    expect(response.getLastResponse()).toBe(exampleText)
    expect(response.getLastResponseAsObject()).toBe(exampleText)
    expect(response.getLastResponseAsObject(false)).toBe(exampleText)

    // Add a Buffer with JSON content to the responses
    buffer = Buffer.from(exampleJSON, 'utf8')
    response.end(buffer)
    expect(response.getLastResponse()).toBe(exampleJSON)
    expect(response.getLastResponseAsObject().AKey).toBe('AValue')
    expect(response.getLastResponseAsObject(false).AKey).toBe('AValue')

    // Add a Uint8Array with a string to the responses
    const encoder = new TextEncoder()
    response.end(encoder.encode(exampleText))
    expect(response.getLastResponse()).toBe(exampleText)
    expect(response.getLastResponseAsObject()).toBe(exampleText)
    expect(response.getLastResponseAsObject(false)).toBe(exampleText)

    // Add a Uint8Array with a JSON string to the responses
    response.end(encoder.encode(exampleJSON))
    expect(response.getLastResponse()).toBe(exampleJSON)
    expect(response.getLastResponseAsObject().AKey).toBe('AValue')
    expect(response.getLastResponseAsObject(false).AKey).toBe('AValue')
})
