import type { IncomingHttpHeaders } from 'node:http'

/**
 * The IncomingHttpHeaders for JSON content type
 */
export const JsonContentTypeHeader: IncomingHttpHeaders = {
    'content-type': 'application/json',
}
