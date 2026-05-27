/*
 * auth service api wrapper
 */

export default class AuthService {

  private apiUrl: string

  constructor(baseUrl: string) {
    this.apiUrl = baseUrl
  }

  login(username: string, password: string) {
    if (!this.apiUrl) {
      console.warn('API URL is missing')
    }

    //placeholder for now use mock data
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (username !== 'admin') {
          return reject(new Error('User not found'))
        }
        if (password !== 'admin') {
          return reject(new Error('Wrong password'))
        }

        const user = {
          username: 'admin',
          token: 'admin-token',
        }
        resolve(user)
      }, 800)
    })

    /*
    return fetch(`${this.apiUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
    */
  }
}

// read from .env 
const apiUrl = import.meta.env.BASE_URL;

export const authService = new AuthService(apiUrl)
