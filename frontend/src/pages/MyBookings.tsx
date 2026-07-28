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

  return (
    <div>
      <h2>Meine Buchungen</h2>
      {bookings.length === 0 && <p>Noch keine Buchungen.</p>}
      {bookings.map((b) => (
        <div key={b.id} className="booking-item">
          <p>
            {new Date(b.start_time).toLocaleString()} – {new Date(b.end_time).toLocaleString()}
          </p>
          <button onClick={() => cancel(b.id)}>Stornieren</button>
        </div>
      ))}
    </div>
  )
}
