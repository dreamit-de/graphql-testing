import { GraphQLServerRequest } from '@dreamit/graphql-server-base'
import { IncomingHttpHeaders } from 'node:http'
import { JsonContentTypeHeader } from './JsonContentTypeHeader'

/**
 * Creates a GraphQLServerRequest for given query and headers.
 * @param {string} query - The GraphQL query.
 * @param {IncomingHttpHeaders} headers - The HTTPHeaders.
 * @returns {GraphQLServerRequest} A GraphQLServerRequest.
 */
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
