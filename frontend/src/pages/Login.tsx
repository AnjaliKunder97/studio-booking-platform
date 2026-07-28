import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../api/client'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const auth = useAuth()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    try {
      await login(email, password)
      auth.login()
      navigate('/dashboard')
    } catch {
      setError('Login fehlgeschlagen. Bitte E-Mail und Passwort prüfen.')
    }
  }

  return (
    <div className="auth-page">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="E-Mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Passwort"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">Einloggen</button>
      </form>
    </div>
  )
}
