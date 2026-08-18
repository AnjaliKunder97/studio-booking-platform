import { useEffect, useState } from 'react'
import { apiFetch } from '../api/client'
import type { Booking } from '../types'

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])

  useEffect(() => {
    apiFetch('/bookings/').then(setBookings).catch(console.error)
  }, [])

  async function cancel(id: number) {
    await apiFetch(`/bookings/${id}`, { method: 'DELETE' })
    setBookings((prev) => prev.filter((b) => b.id !== id))
  }

  function parseUTCDate(dateString: string): Date {
    // If the string already has timezone info (Z or +/-HH:MM), use it as-is.
    // Otherwise, assume it's UTC and append 'Z' so the browser converts it correctly.
    const hasTimezone = /Z|[+-]\d{2}:\d{2}$/.test(dateString)
    return new Date(hasTimezone ? dateString : dateString + 'Z')
  }

  return (
    <div>
      <h2>Meine Buchungen</h2>
      {bookings.length === 0 && <p>Noch keine Buchungen.</p>}
      {bookings.map((b) => (
        <div key={b.id} className="booking-item">
          <p>
            {parseUTCDate(b.start_time).toLocaleString()} – {parseUTCDate(b.end_time).toLocaleString()}
          </p>
          <button onClick={() => cancel(b.id)}>Stornieren</button>
        </div>
      ))}
    </div>
  )
}
