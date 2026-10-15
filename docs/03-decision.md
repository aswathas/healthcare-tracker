# 03 — Decisions

Grounded in the code and in `git log` (12 commits, 2025-02-23 → 2025-02-25).
Where a commit only records a symptom, that is stated rather than guessed at.

## Supabase for database, auth and file storage

`lib/supabase.ts` builds one `createBrowserClient<Database>` with a fixed
storage key `healthtracker-auth`. `types/database.types.ts` types the queries,
so the four tables in `supabase/migrations/` are known to the compiler. Report
files go to a Supabase Storage bucket named `reports`
(`app/api/analyze-reports/route.ts`).

This buys Postgres, auth and object storage behind one credential set. The
cost is that every environment needs a live Supabase project before the app
will render — `lib/supabase.ts` throws on import if
`NEXT_PUBLIC_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` is missing, so
there is no offline mode.

## Auth enforced in middleware, not per page

`middleware.ts` treats everything except `/auth/login`, `/auth/register`,
`/auth/callback` and `/auth/verify-email` as protected, refreshes the session,
and redirects with `?next=` preserved. Route protection is therefore one list
in one file instead of a check in every page.

The history shows this being worked out under pressure. `dfdbd36` ("Revert
'another push'") and `d7a6c6a` ("Reapply 'another push'") are an exact
revert/reapply pair that restructured `hooks/useAuth.ts`, split
`lib/supabase.ts` into `lib/supabaseClient.ts`, and swapped the auth callback
between a page component and a route handler. `22b35ce` ("Suspense Next JS
node error solve") then reworked `app/auth/login/page.tsx`. The revert/reapply
pattern is a guess at *why*; the
fact is that auth churned for about two days and both `@supabase/auth-helpers-nextjs`
and `@supabase/ssr` remain installed. Picking one and deleting the other is an
open cleanup.

## Two Gemini call paths, one client-exposed key

Server routes keep the key private: `app/api/analyze-reports/route.ts` reads
`GEMINI_AI_API_KEY` and `app/api/ai-missions/route.ts` reads `GEMINI_API_KEY`,
both inside a Route Handler.

`lib/gemini.ts` does not. It initialised `GoogleGenerativeAI` at module scope
from `NEXT_PUBLIC_GEMINI_API_KEY`, which Next.js inlined into the client
bundle. That is the AI Doctor (`app/ai-doctor`) path. The exposed key has now
been removed — the module reads server-only `GEMINI_API_KEY` and throws when
that is absent, so the client-side key is no longer shipped. **The AI Doctor
page still calls the module directly from a `'use client'` page and is
therefore broken until it is moved behind a server route**; that refactor is
outstanding. The three-variable split across two naming schemes remains untidy.

Models are `gemini-pro` for text and `gemini-pro-vision` for uploaded reports.
`openai` is in `dependencies` but has no call site anywhere in the repo — it is
dead weight.

## Build-time type and lint checks deliberately disabled

`next.config.js` sets `typescript.ignoreBuildErrors: true` and
`eslint.ignoreDuringBuilds: true`, and also aliases `canvas` and `encoding` to
`false` in webpack — the usual workaround for `jsdom`-shaped dependencies
pulled in transitively.

The first two keep deploys green while the app is mid-build; the cost is that
`npm run build` proves nothing. Run `npx tsc --noEmit` to get the real signal.

## Standalone output

`output: 'standalone'` and `poweredByHeader: false` in `next.config.js`. History
shows a deploy cycle: `8ff18cc` ("Vercel Deployment error") touched
`app/auth/auth-error/page.tsx`, `app/medications/page.tsx` and a dependency, and
`49de664` ("Final Push after template UI update") preceded it. The repo was
being pushed straight to Vercel.

## Scoring lives in pure functions, not components

`utils/calculateSurgicalScores.ts`, `utils/calculateRiskScores.ts` and
`utils/calculateHealthScore.ts` are dependency-free functions over the types in
`types/surgical-markers.ts`. Components (`SurgicalDashboard.tsx`,
`SurgicalVisualization.tsx`) only call them and render. Missing values score
`0.5` — neutral — rather than zero, so an unrecorded test does not read as a
bad one.

This makes the heuristics easy to retune, and it is the shape to preserve. It
also has a cost: there are no tests in the repository, so the scoring logic is
currently unverified.

## Schema lives in two places

`supabase/migrations/20250223163800_init.sql` is the file
`scripts/migrate.js` actually executes. `migrations/0001_init.sql` is an
earlier copy with the same four tables. One of them should go.

## Config files are duplicated

`next.config.js` and `next.config.ts`, `postcss.config.js` and
`postcss.config.mjs`, `tailwind.config.js` and `tailwind.config.ts` all exist.
Next.js resolves the `.js` variants; the `.ts` ones are inert placeholders.
`src/app/` also duplicates `app/` with an older `layout.tsx` and `page.tsx`,
which the root `tsconfig.json` includes via `**/*.tsx`.

## Google Fit and Apple Health are placeholders

`app/settings/page.tsx` renders cards for both using
`/google-fit-icon.svg` and `/apple-health-icon.svg`. No API client, OAuth flow
or callback for either exists in the repo. The settings page presents them as
connectable services; they are not.