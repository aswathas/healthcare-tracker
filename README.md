# Healthcare Tracker

A personal health-records web app: it stores your medical profile, CBC (blood test)
results, doctor visits and medications in Supabase, scores your **surgical readiness**
from those markers, and lets you upload lab/imaging reports for AI analysis.

Built with Next.js 15 App Router, React 19, TypeScript and Tailwind CSS.

> Not a medical device. The scores are heuristic (see `types/surgical-markers.ts`
> weights and `utils/calculateSurgicalScores.ts`), not clinically validated.

## Features

Verified against the routes and components in `app/` and `components/`:

- **Auth** — email/password via Supabase Auth (`app/auth/*`), with
  session refresh and protected-route redirects in `middleware.ts`.
- **Dashboard** — health summary, stats dashboard, recent test results and
  upcoming appointments (`components/dashboard/`).
- **Medical profile** — general history (`app/medical-profile/general`) and
  CBC entry/history (`app/medical-profile/cbc`, `components/cbc/`).
- **Medications** — `app/medications`.
- **Doctor visits** — list plus a new-visit form (`app/doctor-visits`,
  `components/Medical/DoctorVisitForm.tsx`).
- **Reports & AI analysis** — hematology, biochemistry, cardiac and imaging
  sections (`app/reports/*`). Uploading a file hits `POST /api/analyze-reports`,
  which sends it to Gemini (`gemini-pro-vision`) and writes the result back.
- **AI Doctor** — `app/ai-doctor`, backed by `lib/gemini.ts`
  (`gemini-pro`), with optional condition/medication/test context.
- **Health missions** — `POST /api/ai-missions` generates 3-5 suggested missions
  from your conditions (`components/HealthMissions.tsx`).
- **Surgical readiness assessment** — `app/surgical-assessment`, combining
  cardiac, pulmonary, hematological and metabolic markers into risk scores with
  a timeline view and PDF export (`components/SurgicalMarkers/ExportReport.tsx`,
  `@react-pdf/renderer`).
- **Timeline** — `app/timeline`.
- **Settings** — profile and medical preferences. Google Fit / Apple Health
  cards are present as UI only; no integration code is wired up.

## Tech stack

Taken from `package.json`:

- Next.js 15 (App Router, `output: 'standalone'`), React 19, TypeScript strict
- Tailwind CSS 4, Radix UI primitives, Ant Design, `antd` + `@ant-design/icons`,
  Headless UI, Framer Motion, Lucide / Heroicons / React Icons
- Supabase (`@supabase/ssr`, `@supabase/supabase-js`,
  `@supabase/auth-helpers-nextjs`) for Postgres, Auth and Storage
- `@google/generative-ai` (Gemini), `openai` (installed as a dependency; **no
  OpenAI call sites exist in the current code**)
- Recharts and Chart.js + `react-chartjs-2` for charts
- `date-fns`, `@react-pdf/renderer`

## Getting started

```bash
git clone https://github.com/aswathas/healthcare-tracker.git
cd healthcare-tracker
npm install
npm run dev
```

Open <http://localhost:3000>. `/` redirects to `/dashboard` when signed in and
`/auth/login` otherwise (`app/page.tsx`, `middleware.ts`).

Scripts (`package.json`):

| Command | Action |
| --- | --- |
| `npm run dev` | `next dev` |
| `npm run build` | `next build` |
| `npm run start` | `next start` |
| `npm run lint` | `next lint` |

## Configuration

There is **no `.env.example` in the repo** — create `.env.local` yourself. The
variables the code actually reads:

| Variable | Read by | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | `lib/supabase.ts`, `app/api/analyze-reports/route.ts`, `scripts/migrate.js` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `lib/supabase.ts` | Anonymous key. `lib/supabase.ts` throws at import time if URL or key is missing |
| `SUPABASE_SERVICE_KEY` | `app/api/analyze-reports/route.ts`, `scripts/migrate.js` | Service-role key — server side only |
| `GEMINI_AI_API_KEY` | `app/api/analyze-reports/route.ts` | Report analysis |
| `GEMINI_API_KEY` | `app/api/ai-missions/route.ts` | Health-mission generation |
| `NEXT_PUBLIC_GEMINI_API_KEY` | `lib/gemini.ts` | AI Doctor. **Exposed to the browser** — see Security below |

`scripts/migrate.js` loads `.env.local` and then `.env` via `dotenv`, then exits
if the URL or service key are missing.

## Database

SQL lives in `supabase/migrations/`. `20250223163800_init.sql` creates four
tables — `profiles`, `medical_profiles`, `cbc_results`, `doctor_visits` — plus
row-level-security policies. `20240223_update_doctor_visits.sql` alters
`doctor_visits`. A copy of the initial schema also sits at
`migrations/0001_init.sql`.

`scripts/migrate.js` applies `20250223163800_init.sql` to a live project using
the service-role key; `scripts/migrate-client.js`, `scripts/migrate-rest.js` and
`scripts/test-env.js` are also present but are not wired into `package.json`
and are not documented.

## Security notes

- `lib/gemini.ts` sends the AI Doctor key to the client via
  `NEXT_PUBLIC_GEMINI_API_KEY`. For a deployed app, move AI Doctor behind a
  server route the way `app/api/ai-missions/route.ts` already does, and remove
  the exposed key.
- `middleware.ts` sets HSTS, `X-Frame-Options`, `nosniff`, `XSS-Protection` and
  `Referrer-Policy`, plus a CSP that differs between development and production.
- `next.config.js` sets `typescript.ignoreBuildErrors` and
  `eslint.ignoreDuringBuilds` to `true`, so `npm run build` does not type-check
  or lint. Run `npx tsc --noEmit` yourself if you want that gate.
- Both `next.config.js` and `next.config.ts` are present; Next.js uses the
  `.js` one. `postcss.config.js`/`.mjs` and `tailwind.config.js`/`.ts` are
  duplicated the same way. Removing the shadowed files is an easy cleanup.

## Docs

- [`docs/01-problem.md`](docs/01-problem.md) — what problem this app solves
- [`docs/03-decision.md`](docs/03-decision.md) — the choices behind it