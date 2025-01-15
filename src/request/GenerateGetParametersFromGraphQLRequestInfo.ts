import { GraphQLRequestInfo } from '@dreamit/graphql-server-base'

/**
 * Generates a URL param string with the query, operationName and variables of a GraphQLRequestInfo object.
 * @param {GraphQLRequestInfo} requestInfo - The GraphQL request info object.
 * @returns {string} A string with the query, operationName and variables of a GraphQL request info object.
 */
export function generateGetParametersFromGraphQLRequestInfo(
    requestInfo: GraphQLRequestInfo,
): string {
    let result = ''
    if (requestInfo.query) {
        result += `query=${requestInfo.query}&`
    }
    if (requestInfo.operationName) {
        result += `operationName=${requestInfo.operationName}&`
    }
    if (requestInfo.variables) {
        result += `variables=${JSON.stringify(requestInfo.variables)}`
    }
    if (result.endsWith('&')) {
        result = result.slice(0, -1)
    }
    return encodeURI(result)
}
