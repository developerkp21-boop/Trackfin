const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

const resolveUrl = (endpoint) => {
  if (/^https?:\/\//i.test(endpoint)) {
    return endpoint
  }

  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  return `${API_BASE_URL}${normalizedEndpoint}`
}

export const apiRequest = async (endpoint, options = {}, token) => {
  const response = await fetch(resolveUrl(endpoint), {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    },
    ...options
  })

  const isJsonResponse = response.headers.get('content-type')?.includes('application/json')
  const payload = isJsonResponse ? await response.json() : await response.text()

  if (!response.ok) {
    const errorMessage =
      (typeof payload === 'object' && payload !== null && (payload.message || payload.error)) ||
      (typeof payload === 'string' && payload) ||
      'Request failed'

    throw new Error(errorMessage)
  }

  if (response.status === 204) {
    return {}
  }

  if (typeof payload === 'object' && payload !== null) {
    if (Object.hasOwn(payload, 'data')) {
      return payload.data ?? {}
    }

    return payload
  }

  return {}
}
