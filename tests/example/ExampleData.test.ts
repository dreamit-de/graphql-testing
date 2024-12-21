import { graphql } from 'graphql'
import {
    coercedNullValueError,
    coercedNullValueErrorQuery,
    fetchErrorQuery,
    fetchTimeoutError,
    loginMutation,
    logoutMutation,
    returnErrorQuery,
    sdlQuery,
    sensitiveDataErrorQuery,
    sensitiveDataInError,
    userOne,
    userQuery,
    userSchema,
    userSchemaResolvers,
    userSchemaSDL,
    usersQuery,
    userTwo,
    validationErrorMessage,
    validationErrorQuery,
} from 'src/example/ExampleData'
import { expect, test } from 'vitest'

test('Should be able to execute requests against user test schema', async () => {
    // _sdl query
    let result = await graphql({
        rootValue: userSchemaResolvers,
        schema: userSchema,
        source: sdlQuery,
    })
    expect(result.data).toEqual({ _service: { sdl: userSchemaSDL } })

    // CoercedNullValueError mutation
    result = await graphql({
        rootValue: userSchemaResolvers,
        schema: userSchema,
        source: coercedNullValueErrorQuery,
    })
    expect(result.errors?.at(0)?.message).toEqual(coercedNullValueError)

    // FetchError mutation
    result = await graphql({
        rootValue: userSchemaResolvers,
        schema: userSchema,
        source: fetchErrorQuery,
    })
    expect(result.errors?.at(0)?.message).toEqual(fetchTimeoutError)

    // Login mutation without auth context
    result = await graphql({
        rootValue: userSchemaResolvers,
        schema: userSchema,
        source: loginMutation,
    })
    expect(result.data).toEqual({ login: { jwt: 'jwt-' } })

    // Login mutation with auth context
    result = await graphql({
        contextValue: { authHeader: 'MYJWT' },
        rootValue: userSchemaResolvers,
        schema: userSchema,
        source: loginMutation,
    })
    expect(result.data).toEqual({ login: { jwt: 'jwt-MYJWT' } })

    // Logout mutation
    result = await graphql({
        rootValue: userSchemaResolvers,
        schema: userSchema,
        source: logoutMutation,
    })
    expect(result.data).toEqual({ logout: { result: 'Goodbye!' } })

    // Return error query
    result = await graphql({
        rootValue: userSchemaResolvers,
        schema: userSchema,
        source: returnErrorQuery,
    })
    expect(result.errors?.at(0)?.message).toEqual('Something went wrong!')

    // SensitiveDataError query
    result = await graphql({
        rootValue: userSchemaResolvers,
        schema: userSchema,
        source: sensitiveDataErrorQuery,
    })
    expect(result.errors?.at(0)?.message).toEqual(sensitiveDataInError)

    // User query for user one
    result = await graphql({
        rootValue: userSchemaResolvers,
        schema: userSchema,
        source: userQuery,
        variableValues: { id201: userOne.userId },
    })
    expect(result.data).toEqual({ user: userOne })

    // User query for user two
    result = await graphql({
        rootValue: userSchemaResolvers,
        schema: userSchema,
        source: userQuery,
        variableValues: { id201: userTwo.userId },
    })
    expect(result.data).toEqual({ user: userTwo })

    // User query for unknown user
    result = await graphql({
        rootValue: userSchemaResolvers,
        schema: userSchema,
        source: userQuery,
        variableValues: { id201: '3' },
    })
    expect(result.errors?.at(0)?.message).toEqual(
        'User for userid=3 was not found',
    )

    // Users query
    result = await graphql({
        rootValue: userSchemaResolvers,
        schema: userSchema,
        source: usersQuery,
    })
    expect(result.data).toEqual({ users: [userOne, userTwo] })

    // ValidationErrorQuery
    result = await graphql({
        rootValue: userSchemaResolvers,
        schema: userSchema,
        source: validationErrorQuery,
    })
    const error = result.errors?.at(0)
    expect(error?.message).toEqual(validationErrorMessage)
    expect(error?.extensions).toEqual({
        code: 'GRAPHQL_VALIDATION_FAILED',
        serviceName: 'user',
    })
})
