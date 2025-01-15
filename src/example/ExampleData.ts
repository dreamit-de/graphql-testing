import {
    AggregateError,
    GraphQLRequestInfo,
} from '@dreamit/graphql-server-base'
import { buildSchema, GraphQLError, GraphQLSchema } from 'graphql'

// Contains example schemas and data that can be used across tests

export interface User {
    userId: string
    userName: string
}

export interface LoginData {
    jwt: string
}

export interface LogoutResult {
    result: string
}

export const initialSchemaWithOnlyDescription = new GraphQLSchema({
    description: 'initial',
})

export const userOne: User = { userId: '1', userName: 'UserOne' }
export const userTwo: User = { userId: '2', userName: 'UserTwo' }

export const sdlNotFoundResponse = `{
    "errors":[{"message":"Cannot query field \\"_service\\" on type \\"Query\\"."
    ,"locations":[{"line":1,"column":30}],"extensions":{"code":"GRAPHQL_VALIDATION_FAILED"}}]}`

export const sensitiveDataInError =
    'invalid value : invalid value : invalid value : ' +
    'invalid value : Invalid e-mail address format: xy!yz@myfunnymailer.com'
export const coercedNullValueError =
    "Variable 'userName' has an invalid value: " +
    "Variable 'userName' has coerced Null value for NonNull type 'String!'"

export const fetchTimeoutError = 'Request failed ETIMEDOUT connection failed'
export const validationErrorMessage =
    'Cannot query field "userId" on type "User".'

export const aggregateErrorResponse = {
    errors: [
        new GraphQLError('The first error!, The second error!', {
            originalError: {
                errors: [
                    new GraphQLError('The first error!', {}),
                    new GraphQLError('The second error!', {}),
                ],
                message: 'The first error!, The second error!',
                name: 'AggregateError',
            } as AggregateError,
        }),
    ],
}

export const validationError = new GraphQLError(validationErrorMessage, {
    extensions: {
        code: 'GRAPHQL_VALIDATION_FAILED',
        serviceName: 'user',
    },
})

export const aggregateErrorQuery =
    'query AggregateError { aggregateError { id type } }'

export const coercedNullValueErrorQuery =
    'mutation CoercedNullValueError { coercedNullValueError(userName:"magic_man", password:"123456") { jwt } }'
export const userQuery =
    'query user($id201: String!){ user(id: $id201) { userId userName } }'
export const userVariables = '{"id201":"1"}'
export const usersQuery = 'query users{ users { userId userName } }'
export const usersQueryWithUnknownField =
    'query users{ users { userId userName hobby } }'
export const fetchErrorQuery = 'query fetchError{ fetchError { userId } }'
export const returnErrorQuery = 'query returnError{ returnError { userId } }'
export const loginMutation =
    'mutation login{ login(userName:"magic_man", password:"123456") { jwt } }'
export const logoutMutation = 'mutation logout{ logout { result } }'
export const introspectionQuery =
    'query introspection{ __schema { queryType { name } mutationType { name } } }'
export const sensitiveDataErrorQuery =
    'query SensitiveDataError { sensitiveDataError { userId } }'
export const sdlQuery = 'query GetSDL { _service { sdl } }'
export const validationErrorQuery =
    'query ValidationError { validationError { userId } }'

export const usersRequest: GraphQLRequestInfo = {
    operationName: 'users',
    query: usersQuery,
}

export const loginRequest: GraphQLRequestInfo = {
    operationName: 'login',
    query: loginMutation,
}
export const usersRequestWithoutOperationName: GraphQLRequestInfo = {
    query: usersRequest.query,
}
export const usersRequestWithoutVariables: GraphQLRequestInfo = {
    operationName: usersRequest.operationName,
    query: usersRequest.query,
}

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

/**
 * Example GraphQL schema for a fictional user service.
 */
export const userSchema = buildSchema(userSchemaSDL)

/**
 * Schema resolvers for the fictional user service.
 */
export const userSchemaResolvers = {
    _service(): { sdl: string } {
        return { sdl: userSchemaSDL }
    },
    coercedNullValueError(_input: unknown): LoginData {
        throw new GraphQLError(coercedNullValueError, {})
    },
    fetchError(): User {
        throw new GraphQLError('Request failed ETIMEDOUT connection failed', {})
    },
    login(input: unknown, context: Record<string, unknown>): LoginData {
        let jwtValue = 'jwt-'
        if (context && context.authHeader) {
            jwtValue += context.authHeader
            context.jwt = jwtValue
        }
        return { jwt: jwtValue }
    },
    logout(): LogoutResult {
        return { result: 'Goodbye!' }
    },
    returnError(): User {
        throw new GraphQLError('Something went wrong!', {})
    },
    sensitiveDataError(): User {
        throw new GraphQLError(sensitiveDataInError, {})
    },
    user(input: { id: string }): User {
        switch (input.id) {
            case '1': {
                return userOne
            }
            case '2': {
                return userTwo
            }
            default: {
                throw new GraphQLError(
                    `User for userid=${input.id} was not found`,
                    {},
                )
            }
        }
    },
    users(): User[] {
        return [userOne, userTwo]
    },
    validationError(): User {
        throw validationError
    },
}
