import {
    AggregateError,
    GraphQLRequestInfo,
} from '@dreamit/graphql-server-base'
import { buildSchema, GraphQLError, GraphQLSchema } from 'graphql'

// Contains example schemas and data that can be used across tests

interface User {
    userId: string
    userName: string
}

interface LoginData {
    jwt: string
}

interface LogoutResult {
    result: string
}

const initialSchemaWithOnlyDescription = new GraphQLSchema({
    description: 'initial',
})

const userOne: User = { userId: '1', userName: 'UserOne' }
const userTwo: User = { userId: '2', userName: 'UserTwo' }

const sdlNotFoundResponse = `{
    "errors":[{"message":"Cannot query field \\"_service\\" on type \\"Query\\"."
    ,"locations":[{"line":1,"column":30}],"extensions":{"code":"GRAPHQL_VALIDATION_FAILED"}}]}`

const sensitiveDataInError =
    'invalid value : invalid value : invalid value : ' +
    'invalid value : Invalid e-mail address format: xy!yz@myfunnymailer.com'
const coercedNullValueError =
    "Variable 'userName' has an invalid value: " +
    "Variable 'userName' has coerced Null value for NonNull type 'String!'"

const fetchTimeoutError = 'Request failed ETIMEDOUT connection failed'
const validationErrorMessage = 'Cannot query field "userId" on type "User".'

const aggregateErrorResponse = {
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

const validationError = new GraphQLError(validationErrorMessage, {
    extensions: {
        code: 'GRAPHQL_VALIDATION_FAILED',
        serviceName: 'user',
    },
})

const aggregateErrorQuery =
    'query AggregateError { aggregateError { id type } }'

const coercedNullValueErrorQuery =
    'mutation CoercedNullValueError { coercedNullValueError(userName:"magic_man", password:"123456") { jwt } }'
const userQuery =
    'query user($id201: String!){ user(id: $id201) { userId userName } }'
const userVariables = '{"id201":"1"}'
const usersQuery = 'query users{ users { userId userName } }'
const usersQueryWithUnknownField =
    'query users{ users { userId userName hobby } }'
const fetchErrorQuery = 'query fetchError{ fetchError { userId } }'
const returnErrorQuery = 'query returnError{ returnError { userId } }'
const loginMutation =
    'mutation login{ login(userName:"magic_man", password:"123456") { jwt } }'
const logoutMutation = 'mutation logout{ logout { result } }'
const introspectionQuery =
    'query introspection{ __schema { queryType { name } mutationType { name } } }'
const sensitiveDataErrorQuery =
    'query SensitiveDataError { sensitiveDataError { userId } }'
const sdlQuery = 'query GetSDL { _service { sdl } }'
const validationErrorQuery =
    'query ValidationError { validationError { userId } }'

const usersRequest: GraphQLRequestInfo = {
    operationName: 'users',
    query: usersQuery,
}

const loginRequest: GraphQLRequestInfo = {
    operationName: 'login',
    query: loginMutation,
}
const usersRequestWithoutOperationName: GraphQLRequestInfo = {
    query: usersRequest.query,
}
const usersRequestWithoutVariables: GraphQLRequestInfo = {
    operationName: usersRequest.operationName,
    query: usersRequest.query,
}

/**
 * Example GraphQL schema SDL for a fictional user service.
 */
const userSchemaSDL = `schema {
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
const userSchema = buildSchema(userSchemaSDL)

/**
 * Schema resolvers for the fictional user service.
 */
const userSchemaResolvers = {
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
            case '1':
                return userOne
            case '2':
                return userTwo
            default:
                throw new GraphQLError(
                    `User for userid=${input.id} was not found`,
                    {},
                )
        }
    },
    users(): User[] {
        return [userOne, userTwo]
    },
    validationError(): User {
        throw validationError
    },
}

export {
    aggregateErrorQuery,
    aggregateErrorResponse,
    coercedNullValueError,
    coercedNullValueErrorQuery,
    fetchErrorQuery,
    fetchTimeoutError,
    initialSchemaWithOnlyDescription,
    introspectionQuery,
    LoginData,
    loginMutation,
    loginRequest,
    logoutMutation,
    LogoutResult,
    returnErrorQuery,
    sdlNotFoundResponse,
    sdlQuery,
    sensitiveDataErrorQuery,
    sensitiveDataInError,
    User,
    userOne,
    userQuery,
    userSchema,
    userSchemaResolvers,
    userSchemaSDL,
    usersQuery,
    usersQueryWithUnknownField,
    usersRequest,
    usersRequestWithoutOperationName,
    usersRequestWithoutVariables,
    userTwo,
    userVariables,
    validationError,
    validationErrorMessage,
    validationErrorQuery,
}
