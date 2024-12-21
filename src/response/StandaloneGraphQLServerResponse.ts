import { GraphQLServerResponse } from '@dreamit/graphql-server-base'

export class StandaloneGraphQLServerResponse implements GraphQLServerResponse {
    statusCode = 400
    // Response headers are set to lowercase to ease testing
    headers = new Map<string, string | number | readonly string[]>()
    responses: unknown[] = []

    setHeader(name: string, value: string | number | readonly string[]): this {
        this.headers.set(name.toLocaleLowerCase(), value)
        return this
    }
    end(chunk: unknown): this {
        this.responses.push(chunk)
        return this
    }
    removeHeader(name: string): void {
        this.headers.delete(name)
    }
    getLastResponse(): string {
        const response = this.responses.at(-1)
        if (response && response instanceof Buffer) {
            return response.toString('utf8')
        } else if (response && typeof response === 'string') {
            return response
        } else return JSON.stringify(response)
    }
    // eslint-disable-next-line no-explicit-any
    getLastResponseAsObject(): any {
        const response = this.responses.at(-1)
        if (response && response instanceof Buffer === false) {
            return response
        }

        try {
            if (response && response instanceof Buffer) {
                return JSON.parse(response.toString('utf8'))
            }
        } catch {
            return {}
        }
        return {}
    }
}
