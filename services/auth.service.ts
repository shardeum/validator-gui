import Router from 'next/router'
import { useGlobals } from '../utils/globals';

const tokenKey = 'shmguitk'

export const authService = {
  get isLogged() {
    return !!localStorage.getItem(tokenKey)
  },
  get authToken() {
    return localStorage.getItem(tokenKey)
  },
  login,
  logout,
}

function login(password: string) {
  const {apiBase} = useGlobals()
  return fetch(`${apiBase}/auth/login`, {
    headers: {'Content-Type': 'application/json'},
    method: 'POST',
    body: JSON.stringify({ password }),
  }).then(async res => {
    const data = await res.json();
    if(!res.ok) {
        if(res.status === 403){
            throw 'Invalid password!';
        }
        throw 'Error executing login'
    }

    localStorage.setItem(tokenKey, data.accessToken)
  })
}

function logout() {
  localStorage.removeItem(tokenKey)
  Router.push('/login')
}
