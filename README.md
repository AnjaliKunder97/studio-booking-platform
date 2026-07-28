# Studio Booking Platform

A full-stack resource booking system: React + TypeScript frontend, FastAPI +
PostgreSQL backend. Built to demonstrate real authentication, relational
database design, and conflict-safe booking logic — not a mock-API frontend
project.

## Stack

- **Backend:** FastAPI, SQLAlchemy, PostgreSQL, JWT auth (python-jose),
  password hashing (passlib/bcrypt)
- **Frontend:** React 18, TypeScript, React Router, Vite

## Features

- Real registration/login with hashed passwords and JWT access tokens
  (not mocked)
- Relational schema: `users`, `resources`, `bookings`, with a foreign-key
  relationship between all three
- Double-booking prevention: booking creation checks for any existing
  booking on the same resource whose time window overlaps the requested
  one, and rejects it with `409 Conflict`
- Protected routes on the frontend (dashboard requires login)
- Cancel-your-own-booking flow (users can only cancel their own bookings,
  enforced server-side, not just hidden in the UI)

## What's deliberately out of scope

Kept intentionally simple so this stays a focused demo, not an
open-ended backend project:

- **No admin role separation** — the `/resources` create endpoint is open
  so the project is easy to seed/demo. In a real product this would be
  admin-only.
- **No DB-level exclusion constraint for overlaps** — the overlap check
  happens in the application layer (a query before insert), which is
  correct for demo/single-instance use but has a theoretical race
  condition under high concurrency. A production version would add a
  PostgreSQL `EXCLUDE USING gist` constraint for a true DB-level
  guarantee. Worth knowing as the "next step," not something to pretend
  is already there.
- **No payment processing or email notifications.**
- **No password reset flow.**

## Running locally

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env       # then edit DATABASE_URL / SECRET_KEY as needed
uvicorn app.main:app --reload
```

Requires a running PostgreSQL instance matching your `DATABASE_URL`.
Tables are created automatically on first run via
`Base.metadata.create_all`.

API docs available at `http://localhost:8000/docs` (FastAPI's automatic
Swagger UI) once running.

### Seed a resource to book

Since resource creation has no UI yet, seed one via the API docs or curl:

```bash
curl -X POST http://localhost:8000/resources/ \
  -H "Content-Type: application/json" \
  -d '{"name": "Proberaum A", "location": "Leipzig-Plagwitz"}'
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:5173` by default, pointed at the backend via
`VITE_API_URL` (defaults to `http://localhost:8000`).

## Portfolio card summary (for reference)

> Ein Buchungssystem für Ressourcen (z. B. Proberäume, Equipment) mit
> echter Authentifizierung (JWT), relationalem Datenmodell und
> serverseitiger Konflikterkennung: Überschneidende Buchungen für dieselbe
> Ressource werden zuverlässig abgelehnt. Bewusst fokussiert auf Kernlogik
> — ohne Zahlungsabwicklung oder Admin-Rollen, um das Projekt in
> überschaubarem Rahmen zu halten.
