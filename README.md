# We make IT work – Service Hub

Dieses Monorepo stellt das Grundgerüst der mandantenfähigen Musikplattform bereit. Es folgt der in der Spezifikation
beschriebenen Architektur mit einem Next.js Frontend (App Router) und einem NestJS Backend.

## Struktur

```
apps/
  web/      # Next.js 13 App Router mit Tailwind, Framer Motion, Zustand
  api/      # NestJS API mit modularer Architektur und TypeORM-Entities
packages/
  ui/       # Wiederverwendbare Glass-Komponenten
  types/    # Geteilte TypeScript-Interfaces
```

## Frontend Highlights
- Liquid-Glass Landingpage mit Hero, Feature-Gitter, Pricing und Security-Sektion
- KPI-Bento Mockup mit wiederverwendbarer `KPIWidget` Komponente
- Theme-Logik via `TimeAwareBackground` und Zustand Store für UI-Präferenzen

## Backend Highlights
- Authentifizierung mit Register- und Login-Endpoints (JWT-basierter Token-Return)
- Projekte, Boards, Tasks, Files, Analytics, Templates, Shares und Settings Module mit exemplarischen Endpoints
- Health Endpoint (`/health`) für Monitoring und Testbarkeit
- TypeORM Entities für `users`, `organizations`, `projects`

## Erste Schritte

```bash
pnpm install
pnpm dev:web      # Frontend
pnpm dev:api      # Backend
```

Um eine Datenbank anzubinden, setze die Umgebungsvariable `DATABASE_URL` (PostgreSQL). Standardmäßig laufen die Mock-
Implementierungen in Memory.

## Nächste Schritte
- Vollständige Persistenz der Module (Boards, Tasks, Files, Analytics) auf PostgreSQL
- Integration von Strapi via ISR Hooks für Landing-Content und Ankündigungen
- OAuth-Connectoren für GA4, Meta, TikTok, YouTube sowie Streaming-Portale
- Echtzeit-Gateways (WebSockets) für Boards und Moodboard
- CI/CD mit Tests (Jest, Playwright), Security-Scans und Infrastruktur als Code
