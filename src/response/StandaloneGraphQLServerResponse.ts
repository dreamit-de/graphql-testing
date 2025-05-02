import { StandaloneGraphQLServerResponseCompat } from './StandaloneGraphQLServerResponseCompat'

/**
 * GraphQLServerResponse implementation that can be used standalone without a webserver
 */
export class StandaloneGraphQLServerResponse extends StandaloneGraphQLServerResponseCompat {
    setHeader(name: string, value: string | number | readonly string[]): this {
        this.headers.set(name.toLocaleLowerCase(), value)
        return this
    }
    end(chunk: unknown): this {
        this.responses.push(chunk)
        return this
    }
}
