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

## Deployment notes

Deployed on Render: PostgreSQL (managed), backend as a Web Service,
frontend as a Static Site. A few things worth knowing if you're
redeploying or forking this:

- **CORS**: the backend reads allowed origins from an `ALLOWED_ORIGINS`
  env var (comma-separated), defaulting to `http://localhost:5173` for
  local dev. Set it to the deployed frontend's exact URL (no trailing
  slash) in production.
- **bcrypt/passlib compatibility**: newer `bcrypt` releases break
  `passlib`'s internal version check, causing a confusing
  "password cannot be longer than 72 bytes" error on registration.
  `requirements.txt` pins `bcrypt==4.0.1` to avoid this.
- **SPA routing on Render's static hosting**: without a rewrite rule,
  refreshing on any route other than `/` (e.g. `/dashboard`) 404s,
  since the host looks for a matching file rather than deferring to
  React Router. Fixed via a Redirect/Rewrite rule: `/*` → `/index.html`
  (Rewrite, not Redirect).
- **TypeScript + `import.meta.env`**: needs a `src/vite-env.d.ts` file
  with `/// <reference types="vite/client" />`, or a strict `tsc` build
  (as run in CI/Render) fails even though local `vite dev` works fine.

## Live

- **App:** https://studio-booking-platform-1.onrender.com
- **API docs:** https://studio-booking-platform.onrender.com/docs

Hosted on Render's free tier — the first request after a period of
inactivity can take up to a minute to wake the server back up; after
that it runs normally.

## Portfolio card summary (for reference)

> Ein Buchungssystem für Ressourcen wie Proberäume oder Equipment —
> bewusst als vollständiges Full-Stack-Projekt aufgesetzt, um eine Lücke
> zu schließen, die mir in Stellenausschreibungen wiederholt begegnet
> ist: echte Backend-Erfahrung neben meiner Frontend-Expertise, inklusive
> Authentifizierung, relationalem Datenmodell und einer API, die ich
> selbst entworfen und implementiert habe.
>
> Das Backend (FastAPI, PostgreSQL, SQLAlchemy) bietet echte
> JWT-basierte Authentifizierung mit gehashten Passwörtern sowie ein
> relationales Schema aus Nutzer:innen, Ressourcen und Buchungen. Der
> interessante Teil: Überschneidende Buchungen für dieselbe Ressource
> werden serverseitig zuverlässig abgelehnt — keine Simulation, sondern
> eine echte Prüfung auf Zeitraum-Konflikte.
>
> Bewusst schlank gehalten: keine Zahlungsabwicklung, keine
> Admin-Rollen-Trennung und die Konflikterkennung läuft aktuell auf
> Anwendungsebene statt über eine datenbankseitige
> Exclusion-Constraint — der nächste sinnvolle Schritt für eine
> produktionsreife Version.
