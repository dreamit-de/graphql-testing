/* eslint-disable max-len */
import { generateGetParametersFromGraphQLRequestInfo } from 'src'
import { expect, test } from 'vitest'

test.each`
    query          | operationName   | variables     | expectedGetParameters
    ${'testQuery'} | ${'testOpName'} | ${'testVars'} | ${'query=testQuery&operationName=testOpName&variables=%22testVars%22'}
    ${undefined}   | ${'testOpName'} | ${'testVars'} | ${'operationName=testOpName&variables=%22testVars%22'}
    ${'testQuery'} | ${undefined}    | ${'testVars'} | ${'query=testQuery&variables=%22testVars%22'}
    ${'testQuery'} | ${'testOpName'} | ${undefined}  | ${'query=testQuery&operationName=testOpName'}
`(
    'For the given query $query , operation name $operationName and variables $variables the expected parameters are created $expectedGetParameters',
    ({ query, operationName, variables, expectedGetParameters }) => {
        expect(
            generateGetParametersFromGraphQLRequestInfo({
                operationName: operationName,
                query: query,
                variables: variables,
            }),
        ).toBe(expectedGetParameters)
    },
)
