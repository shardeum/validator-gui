
export const useAuth = (apiPort:string, password: string) => {
  fetch(`http://${globalThis.window?.location.hostname}:${apiPort}/auth/login`, {
    method: 'POST',
    body: JSON.stringify({ password: password }),
  })
}
