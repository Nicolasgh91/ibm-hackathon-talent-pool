/**
 * Axios adapter that resolves requests using the in-memory mock router instead
 * of going through the network. Wired into the shared axios instance from
 * `services/api.ts` either eagerly (when demo mode is on) or as an automatic
 * fallback when the real backend errors out.
 */
import { AxiosError, AxiosHeaders } from 'axios'
import type { AxiosAdapter, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { MockHttpError, mockHandlers } from './mockHandlers'

function normalizeUrl(rawUrl: string | undefined, baseUrl: string | undefined): string {
  let url = rawUrl ?? ''
  // Drop the absolute prefix (axios may have already concatenated baseURL)
  if (baseUrl && url.startsWith(baseUrl)) url = url.slice(baseUrl.length)
  url = url.replace(/^https?:\/\/[^/]+/i, '')
  url = url.replace(/^\/?api\/v1/, '')
  if (!url.startsWith('/')) url = '/' + url
  return url.split('?')[0] || '/'
}

function safeParseBody(data: unknown): unknown {
  if (data == null) return undefined
  if (typeof data !== 'string') return data
  try {
    return JSON.parse(data)
  } catch {
    return data
  }
}

function flattenHeaders(
  headers: InternalAxiosRequestConfig['headers'],
): Record<string, string | undefined> {
  const out: Record<string, string | undefined> = {}
  if (!headers) return out
  // AxiosHeaders has a normalize/forEach API; fall back to Object iteration.
  const ah = headers as AxiosHeaders
  if (typeof ah.forEach === 'function') {
    ah.forEach((value: unknown, key: string) => {
      out[key.toLowerCase()] = value == null ? undefined : String(value)
    })
    return out
  }
  for (const [k, v] of Object.entries(headers as Record<string, unknown>)) {
    out[k.toLowerCase()] = v == null ? undefined : String(v)
  }
  return out
}

export const mockAdapter: AxiosAdapter = async (config) => {
  const url = normalizeUrl(config.url, config.baseURL)
  const method = (config.method ?? 'get').toUpperCase()
  const body = safeParseBody(config.data)
  const headers = flattenHeaders(config.headers)
  const params = (config.params ?? {}) as Record<string, unknown>

  try {
    const { status, data } = await mockHandlers.handle({ method, url, body, params, headers })
    const responseHeaders = new AxiosHeaders({ 'content-type': 'application/json' })
    const response: AxiosResponse = {
      data,
      status,
      statusText: status === 204 ? 'No Content' : 'OK',
      headers: responseHeaders,
      config,
      request: undefined,
    }
    return response
  } catch (e) {
    if (e instanceof MockHttpError) {
      const responseHeaders = new AxiosHeaders({ 'content-type': 'application/json' })
      const errorResponse: AxiosResponse = {
        data: { message: e.message, code: `MOCK_${e.status}` },
        status: e.status,
        statusText: 'Mock Error',
        headers: responseHeaders,
        config,
        request: undefined,
      }
      throw new AxiosError(
        e.message,
        `MOCK_${e.status}`,
        config,
        undefined,
        errorResponse,
      )
    }
    throw e
  }
}

// Made with Bob
