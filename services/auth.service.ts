import Router from 'next/router'
import { useGlobals } from '../utils/globals'
import { hashSha256 } from '../utils/sha256-hash';
import { useCallback } from "react";

const isLoggedInKey = 'isLoggedIn'

function useLogin() {
  const { apiBase } = useGlobals();

  return useCallback(async (password: string) => {
    const sha256digest = await hashSha256(password);
    const res = await fetch(`${apiBase}/auth/login`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({ password: sha256digest }),
    });
    await res.json();
    if (!res.ok) {
      if (res.status === 403) {
        throw new Error('The password you’ve entered is invalid. Please enter the correct password');
      }
    }
    localStorage.setItem(isLoggedInKey, 'true');
  }, [apiBase]);
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
  Router.push('/login')
}

export const authService = {
  get isLogged(): boolean {
    return !!localStorage.getItem(isLoggedInKey)
  },
  useLogin,
  logout,
}
