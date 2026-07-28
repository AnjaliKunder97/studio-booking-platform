const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export function getToken() {
  return localStorage.getItem('token')
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${API_URL}${path}`, { ...options, headers })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail || 'Request failed')
  }
  // DELETE endpoints may return a small JSON body; guard against empty bodies.
  const text = await res.text()
  return text ? JSON.parse(text) : null
}

export async function login(email: string, password: string) {
  // FastAPI's OAuth2PasswordRequestForm expects x-www-form-urlencoded,
  // with the email sent under the "username" field.
  const body = new URLSearchParams()
  body.append('username', email)
  body.append('password', password)

  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Login failed' }))
    throw new Error(err.detail || 'Login failed')
  }
  const data = await res.json()
  localStorage.setItem('token', data.access_token)
  return data
}

export function logout() {
  localStorage.removeItem('token')
}
