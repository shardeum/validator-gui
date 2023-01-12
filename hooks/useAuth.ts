export const useAuth = (password: string) => {
  fetch(`http://localhost:8080/auth/login`, {
    method: 'POST',
    body: JSON.stringify({ password: password }),
  })
}
