import { useState } from 'react'
import BookingForm from '../components/BookingForm'
import ResourceList from '../components/ResourceList'
import type { Resource } from '../types'
import MyBookings from './MyBookings'

export default function Dashboard() {
  const [selected, setSelected] = useState<Resource | undefined>()
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <div className="dashboard">
      <div className="dashboard-col">
        <h2>Ressourcen</h2>
        <ResourceList onSelect={setSelected} selectedId={selected?.id} />
      </div>
      <div className="dashboard-col">
        {selected ? (
          <BookingForm resource={selected} onBooked={() => setRefreshKey((k) => k + 1)} />
        ) : (
          <p>Wähle links eine Ressource aus, um einen Slot zu buchen.</p>
        )}
      </div>
      <div className="dashboard-col">
        <MyBookings key={refreshKey} />
      </div>
    </div>
  )
}
