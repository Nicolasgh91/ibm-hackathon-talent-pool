import axios, { AxiosError } from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'
import type { ApiError } from '@/types'
import { enableDemoMode, isDemoMode } from '@/mocks/demoMode'
import { mockAdapter } from '@/mocks/mockAdapter'
import { trackApiTransport } from '@/mocks/apiTransportStats'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1'

interface DemoCapableConfig extends InternalAxiosRequestConfig {
  _isDemoRetry?: boolean
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
})

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('auth_token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    // If demo mode was already activated this session, short-circuit the
    // network and resolve the request through the in-memory router.
    const demo = isDemoMode()
    trackApiTransport(demo)
    if (demo) {
      ;(config as DemoCapableConfig).adapter = mockAdapter
    }
    return config
  },
  (error: AxiosError) => Promise.reject(error),
)

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const config = error.config as DemoCapableConfig | undefined
    const isNetwork = !error.response
    const isServerError = error.response && error.response.status >= 500

    // Auto-fallback: first time the backend is unreachable (or 5xx) we flip
    // demo mode on and retry the same request once via the mock adapter so the
    // caller still receives data instead of an error toast.
    if (config && !config._isDemoRetry && (isNetwork || isServerError)) {
      const reason = isNetwork
        ? `network: ${error.code ?? error.message}`
        : `http ${error.response?.status}`
      enableDemoMode(reason)
      const retryConfig: DemoCapableConfig = {
        ...config,
        _isDemoRetry: true,
        adapter: mockAdapter,
      }
      try {
        return await api.request(retryConfig)
      } catch (retryError) {
        return Promise.reject(retryError)
      }
    }

    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      // In demo mode the synthetic token is always valid; never bounce the
      // user away from whatever route they're on. The next call will mint a
      // fresh mock session if needed.
      if (!isDemoMode()) {
        window.location.href = '/login'
      }
    }

    if (!error.response) {
      return Promise.reject({
        message: 'Network error. Please check your connection.',
        code: 'NETWORK_ERROR',
      } as ApiError)
    }

    const apiError: ApiError = {
      message: error.response.data?.message || 'An unexpected error occurred',
      code: error.response.data?.code || `HTTP_${error.response.status}`,
      details: error.response.data?.details,
    }

    return Promise.reject(apiError)
  },
)

export default api

// Made with Bob
