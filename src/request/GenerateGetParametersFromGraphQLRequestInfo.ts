import { GraphQLRequestInfo } from '@dreamit/graphql-server-base'

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
