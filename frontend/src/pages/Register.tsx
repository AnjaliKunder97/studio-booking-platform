import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiFetch } from '../api/client'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    try {
      await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, full_name: fullName }),
      })
      navigate('/login')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registrierung fehlgeschlagen.')
    }
  }

  return (
    <div className="auth-page">
      <h1>Registrieren</h1>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
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
        <button type="submit">Konto erstellen</button>
      </form>
    </div>
  )
}
