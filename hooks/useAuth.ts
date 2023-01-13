
export const useAuth = (apiPort:string, password: string) => {
  fetch(`http://localhost:${apiPort}/auth/login`, {
    method: 'POST',
    body: JSON.stringify({ password: password }),
  })
}
