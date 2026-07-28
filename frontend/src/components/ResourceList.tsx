import { useEffect, useState } from 'react'
import { apiFetch } from '../api/client'
import type { Resource } from '../types'

interface Props {
  onSelect: (resource: Resource) => void
  selectedId?: number
}

export default function ResourceList({ onSelect, selectedId }: Props) {
  const [resources, setResources] = useState<Resource[]>([])

  useEffect(() => {
    apiFetch('/resources/').then(setResources).catch(console.error)
  }, [])

  return (
    <div className="resource-list">
      {resources.length === 0 && <p>Keine Ressourcen gefunden. Zuerst welche anlegen (siehe README).</p>}
      {resources.map((r) => (
        <div
          key={r.id}
          className={`resource-card ${selectedId === r.id ? 'selected' : ''}`}
          onClick={() => onSelect(r)}
        >
          <h3>{r.name}</h3>
          <p>{r.location}</p>
        </div>
      ))}
    </div>
  )
}
