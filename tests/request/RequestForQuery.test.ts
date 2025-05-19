/* eslint-disable max-len */
import type { IncomingHttpHeaders } from 'node:http'
import { usersQuery } from 'src/example/ExampleData'
import { JsonContentTypeHeader } from 'src/request/JsonContentTypeHeader'
import { requestForQuery } from 'src/request/RequestForQuery'
import { expect, test } from 'vitest'

const textContentTypeHeader: IncomingHttpHeaders = {
    'content-type': 'text/html',
}

test.each`
    query         | headers                  | expectedBody                   | expectedHeaders
    ${usersQuery} | ${undefined}             | ${`{"query":"${usersQuery}"}`} | ${JsonContentTypeHeader}
    ${usersQuery} | ${textContentTypeHeader} | ${`{"query":"${usersQuery}"}`} | ${textContentTypeHeader}
`(
    'For the given query $query and headers $headers the expected Request object is created with body $expectedServerRequest',
    async ({ query, headers, expectedBody, expectedHeaders }) => {
        const request = requestForQuery(query, headers)
        expect(request.body).toStrictEqual(expectedBody)
        expect(request.headers).toStrictEqual(expectedHeaders)
        expect(request.method).toStrictEqual('POST')
        expect(request.url).toStrictEqual('/graphql')
        expect(request.text).toBeDefined()
        expect(request.text).toBeInstanceOf(Function)
        if (request.text) {
            expect(request.text()).resolves.toStrictEqual(expectedBody)
        } else {
            throw new Error('request.text is undefined')
        }
    },
)
