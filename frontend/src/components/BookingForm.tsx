import { FormEvent, useState } from 'react'
import { apiFetch } from '../api/client'
import type { Resource } from '../types'

interface Props {
  resource: Resource
  onBooked: () => void
}

export default function BookingForm({ resource, onBooked }: Props) {
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setMessage('')
    try {
      await apiFetch('/bookings/', {
        method: 'POST',
        body: JSON.stringify({
          resource_id: resource.id,
          start_time: new Date(start).toISOString(),
          end_time: new Date(end).toISOString(),
        }),
      })
      setMessage('Buchung erfolgreich!')
      setStart('')
      setEnd('')
      onBooked()
    } catch (err) {
      // The backend returns 409 with a clear message when the slot
      // was already taken by someone else — surfaced here directly.
      setMessage(err instanceof Error ? err.message : 'Buchung fehlgeschlagen.')
    }
  }

  return (
    <form className="booking-form" onSubmit={handleSubmit}>
      <h3>Buchen: {resource.name}</h3>
      <label>
        Start
        <input
          type="datetime-local"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          required
        />
      </label>
      <label>
        Ende
        <input
          type="datetime-local"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          required
        />
      </label>
      <button type="submit">Slot buchen</button>
      {message && <p className="form-message">{message}</p>}
    </form>
  )
}
