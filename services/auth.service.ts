import Router from 'next/router'
import { hashSha256 } from '../utils/sha256-hash';

const isLoggedInKey = 'isLoggedIn'
export const wasLoggedOutKey = 'wasLoggedOut'
export const isFirstTimeUserKey = 'isFirstTimeUser'

export async function getCsrfToken(): Promise<string> {
  document.cookie = "csrf-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  const response = await fetch(`/csrf-token`, {
    signal: AbortSignal.timeout(2000),
  });

  if (!response.ok) {
    throw new Error('Token was not received.');
  }

  return await response.text();
}
const login = async (apiBase: string, password: string) => {
  const sha256digest = await hashSha256(password);
  const csrfToken = await getCsrfToken();
  const res = await fetch(`${apiBase}/auth/login`, {
    headers: { 'Content-Type': 'application/json' , 'X-Csrf-Token': csrfToken},
    method: 'POST',
    body: JSON.stringify({ password: sha256digest }),
    credentials: 'include',
  });
  await res.json();
  if (!res.ok) {
    if (res.status === 403) {
      throw new Error('The password you’ve entered is invalid. Please enter the correct password');
    }
  }
  localStorage.setItem(isLoggedInKey, 'true');

  const isFirstTimeUserFlagPresent = localStorage.getItem(isFirstTimeUserKey);
  if (isFirstTimeUserFlagPresent) {
    localStorage.setItem(isFirstTimeUserKey, 'false');
  }
  else {
    localStorage.setItem(isFirstTimeUserKey, 'true');
  }
}

async function logout(apiBase: string) {
  const res = await fetch(`${apiBase}/auth/logout`, {
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  })
  if (res.status != 200) {
    throw new Error('Error logging out!');
  }
  localStorage.removeItem(isLoggedInKey)
  localStorage.setItem(wasLoggedOutKey, "true")
  Router.push('/login')
}

export const authService = {
  get isLogged(): boolean {
    return !!localStorage.getItem(isLoggedInKey)
  },
  login,
  logout,
}
