import { GraphQLServerResponse } from '@dreamit/graphql-server-base'

/**
 * GraphQLServerResponse implementation that can be used standalone without a webserver
 */
export class StandaloneGraphQLServerResponse implements GraphQLServerResponse {
    statusCode = 400
    // Response headers are set to lowercase to ease testing
    headers = new Map<string, string | number | readonly string[]>()

    /**
     * Set responses in an unknown array
     */
    responses: unknown[] = []

    textDecoder: TextDecoder = new TextDecoder()

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

    /**
     * Returns the last response as a string
     * @returns {string} The last response as a string
     */
    getLastResponse(): string {
        const response = this.responses.at(-1)
        if (response instanceof Uint8Array) {
            return this.textDecoder.decode(response)
        } else if (typeof response === 'string') {
            return response
        }
        return JSON.stringify(response)
    }

    /**
     * Returns the last response as an object
     * @param {boolean} parseStringToJSON - Whether to parse a string response to JSON. If it is parseable, it will be parsed to an object, otherwise it will be returned as a string.
     * @returns {string} The last response as a string
     */
    // eslint-disable-next-line no-explicit-any
    getLastResponseAsObject(parseStringToJSON = true): any {
        const response = this.responses.at(-1)
        if (typeof response === 'string' && parseStringToJSON) {
            try {
                return JSON.parse(response)
            } catch {
                return response
            }
        } else if (response instanceof Uint8Array) {
            const decodedResponse = this.textDecoder.decode(response)
            try {
                return JSON.parse(decodedResponse)
            } catch {
                return decodedResponse
            }
        } else {
            return response
        }
    }
}
