/* eslint-disable max-len */
import { IncomingHttpHeaders } from 'node:http'
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
    ({ query, headers, expectedBody, expectedHeaders }) => {
        expect(requestForQuery(query, headers)).toStrictEqual({
            body: expectedBody,
            headers: expectedHeaders,
            method: 'POST',
            url: '/graphql',
        })
    },
)
