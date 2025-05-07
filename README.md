# graphql-testing

Test helper and functions to test GraphQL logic with and without [@dreamit/graphql-server][1]

## Install

```sh
npm i -D @dreamit/graphql-testing
```

As it seems to be unlikely that the test logic is used in production code it is recommended to install `graphql-testing` as devDependency.

## Test helpers

`graphql-testing` provides some helper function and classes to ease testing GraphQL logic.

### Logging

- **JsonTestLogger**: [@dreamit/graphql-server][1] `Logger` implementation that saves created log entries in an LogEntry array.
- **NoConsole**: A `Console` that does nothing
- **NoLogger**: [@dreamit/graphql-server][1] `Logger` implementation that does not log or output anything.
- **TextTestLogger**: [@dreamit/graphql-server][1] `Logger` implementation that saves created log entries in a string array.

Example usage:

```typescript
test('Error entry should be written', () => {
    const defaultLogger = new JsonTestLogger()
    const testError = new Error('error')
    testError.stack = 'stacktrace'
    defaultLogger.error('error', {}, testError, 'custom', testDateFunction)
    const createdLogEntry = defaultLogger.logEntries.at(0)
    expect(createdLogEntry?.level).toBe('ERROR')
    expect(createdLogEntry?.message).toBe('error')
    expect(createdLogEntry?.errorName).toBe('custom')
    expect(createdLogEntry?.stacktrace).toBe('stacktrace')
})

test('Info entry should be written', () => {
    const defaultLogger = new JsonTestLogger()
    defaultLogger.info('info', {}, testDateFunction)
    const createdLogEntry = defaultLogger.logEntries.at(0)
    expect(createdLogEntry?.level).toBe('INFO')
    expect(createdLogEntry?.message).toBe('info')
})

test('Warn entry should be written', () => {
    const defaultLogger = new JsonTestLogger()
    defaultLogger.warn('warn', {}, testDateFunction)
    const createdLogEntry = defaultLogger.logEntries.at(0)
    expect(createdLogEntry?.level).toBe('WARN')
    expect(createdLogEntry?.message).toBe('warn')
})
```

### Request

- **generateGetParametersFromGraphQLRequestInfo**: Generates a URL param string with the query, operationName and variables of a [@dreamit/graphql-server][1] `GraphQLRequestInfo` object.
- **JsonContentTypeHeader**: The `IncomingHttpHeaders` for JSON content type.
- **generateGetParametersFromGraphQLRequestInfo**: Creates a [@dreamit/graphql-server][1] `GraphQLServerRequest` for given query and headers.

Example usage:

```typescript
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
```

### Response

- **StandaloneGraphQLServerResponse**: [@dreamit/graphql-server][1] `GraphQLServerResponse` implementation that can be used standalone without a webserver. Supports `string`, `object` and `Uint8Array`/`Buffer`. **StandaloneGraphQLServerResponseCompat** only implements `send` and `header` function and can be used to test fallback behavior for webserver compatibility
    - **responses**: Field containing set responses in an unknown array.
    - **getLastResponse**: Returns the last response as a string.
    - **getLastResponseAsObject(parseStringToJSON = true)**: Returns the last response as an object. If parseStringToJSON is true it will try to parse a string response to an object and returns the string if it is not possible.

Example usage:

```typescript
test('StandaloneGraphQLServerResponse should work as expected', () => {
    const response = new StandaloneGraphQLServerResponse()

    // Add JSON string to the responses
    response.end('{"AKey":"AValue"}')
    expect(response.getLastResponse()).toBe('{"AKey":"AValue"}')
    expect(response.getLastResponseAsObject().AKey).toBe('AValue')
    expect(response.getLastResponseAsObject(false)).toBe('{"AKey":"AValue"}')

    // Add an object to the responses
    const userServerRequest = requestForQuery(userQuery)
    response.end(userServerRequest)
    expect(response.getLastResponse()).toBe(JSON.stringify(userServerRequest))
    expect(response.getLastResponseAsObject()).toStrictEqual(userServerRequest)
    expect(response.getLastResponseAsObject(false)).toStrictEqual(
        userServerRequest,
    )
})
```

## Example Data

To provide and/or test a GraphQL server `graphql-testing` provides example data in form of SDL, GraphQLSchema, resolvers, queries, ... .

SDL for example **user** service:

```typescript
/**
 * Example GraphQL schema SDL for a fictional user service.
 */
export const userSchemaSDL = `schema {
    query: Query
    mutation: Mutation
  }
  
  type Query {
    _service: _Service
    fetchError: User
    returnError: User
    sensitiveDataError: User
    users: [User]
    user(id: String!): User
    validationError: User
  }
  
  type Mutation {
    coercedNullValueError(userName: String, password: String): LoginData
    login(userName: String, password: String): LoginData
    logout: LogoutResult
  }

  type _Service {
    sdl: String
  }
  
  type User {
    userId: String
    userName: String
  }
  
  type LoginData {
    jwt: String
  }
  
  type LogoutResult {
    result: String
  }
`
```

This SDL can be used with `userSchema` and `userSchemaResolvers` to create a GraphQL server with queries and mutations to test how the server can handle them.

Queries and mutations:

- **\_service**: Returns the SDL of the service. Can e.g. be used with federated schemas.
- **coercedNullValueError**: Returns a CoercedNullValue in a GraphQLError "Variable 'userName' has coerced Null value for NonNull type 'String!'".
- **fetchError**: Returns a FetchError in a GraphQLError "Request failed ETIMEDOUT connection failed".
- **login**: Simulates a login by returning a JWT containing "jwt-" and a value from `context.authHeader` if set.
- **logout**: Returns a fixed logout message "Goodbye!"
- **returnError**: Returns a GraphQLError "Something went wrong!".
- **sensitiveDataError**: Returns a GraphQLError with sensitive information "invalid value : Invalid e-mail address format: xy!yz@myfunnymailer.com".
- **user**: Given a user ID returns `userOne`, `userTwo` or a GraphQLError if the user is not found.
- **users**: Returns an array containing `userOne` and `userTwo`
- **validationError**: Returns a ValidationError in a GraphQLError "Cannot query field 'userId' on type 'User'.".

Example usage using `graphql` function from [graphql-js][2]:

```typescript
// _sdl query
let result = await graphql({
    rootValue: userSchemaResolvers,
    schema: userSchema,
    source: sdlQuery,
})
expect(result.data).toEqual({ _service: { sdl: userSchemaSDL } })

// Login mutation with auth context
result = await graphql({
    contextValue: { authHeader: 'MYJWT' },
    rootValue: userSchemaResolvers,
    schema: userSchema,
    source: loginMutation,
})
expect(result.data).toEqual({ login: { jwt: 'jwt-MYJWT' } })

// Return error query
result = await graphql({
    rootValue: userSchemaResolvers,
    schema: userSchema,
    source: returnErrorQuery,
})
expect(result.errors?.at(0)?.message).toEqual('Something went wrong!')
```

## Contact

If you have questions or issues please visit our [Issue page](https://github.com/dreamit-de/graphql-testing/issues)
and open a new issue if there are no fitting issues for your topic yet.

## License

graphql-server is under [MIT-License](./LICENSE).

[1]: https://github.com/dreamit-de/graphql-server
[2]: https://github.com/graphql/graphql-js
