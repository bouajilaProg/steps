export interface AuthUser {
  id: string
  username: string
}

export interface LoginResponse {
  user: AuthUser
  accessToken: string
}

export default class AuthService {
  private apiUrl: string

  constructor(baseUrl: string) {
    this.apiUrl = baseUrl
  }

  async login(username: string, password: string): Promise<LoginResponse> {
    if (!this.apiUrl) {
      throw new Error('API URL is missing')
    }

    const response = await fetch(`${this.apiUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })

    if (!response.ok) {
      const body = await response.json().catch(() => ({}))
      throw new Error(body.message || `Login failed (${response.status})`)
    }

    const data: LoginResponse = await response.json()

    localStorage.setItem('accessToken', data.accessToken)
    localStorage.setItem('user', JSON.stringify(data.user))

    return data
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken')
  }

  getStoredUser(): AuthUser | null {
    const raw = localStorage.getItem('user')
    if (!raw) return null
    try {
      return JSON.parse(raw)
    } catch {
      return null
    }
  }

  logout() {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')
  }

  isAuthenticated(): boolean {
    return !!this.getToken()
  }
}

const apiUrl = import.meta.env.VITE_API_URL

export const authService = new AuthService(apiUrl)
