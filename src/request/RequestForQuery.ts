import { GraphQLServerRequest } from '@dreamit/graphql-server-base'
import { IncomingHttpHeaders } from 'node:http'
import { JsonContentTypeHeader } from './JsonContentTypeHeader'

export function requestForQuery(
    query: string,
    headers: IncomingHttpHeaders = JsonContentTypeHeader,
): GraphQLServerRequest {
    return {
        body: `{ query: '${query}' }`,
        headers: headers,
        method: 'POST',
        url: '/graphql',
    }
}
