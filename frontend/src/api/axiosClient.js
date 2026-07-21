import axios from 'axios'
import { clearAccessToken, getAccessToken } from '../utils/auth'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000'

const axiosClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: false,
})

let hasHandledUnauthorized = false

axiosClient.interceptors.request.use((config) => {
  const token = getAccessToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

axiosClient.interceptors.response.use(
  (response) => {
    hasHandledUnauthorized = false
    return response
  },
  (error) => {
    const statusCode = error?.response?.status
    const url = error?.config?.url

    // Handle 404 on /api/auth/me - token is invalid, user doesn't exist, or session expired
    if (statusCode === 404 && url?.includes('/api/auth/me')) {
      clearAccessToken()

      if (!hasHandledUnauthorized && window.location.pathname.startsWith('/app')) {
        hasHandledUnauthorized = true
        window.location.replace('/login')
      }
    }

    if (statusCode === 401) {
      clearAccessToken()

      if (!hasHandledUnauthorized && window.location.pathname.startsWith('/app')) {
        hasHandledUnauthorized = true
        window.location.replace('/login')
      }
    }

    return Promise.reject(error)
  },
)

export default axiosClient
