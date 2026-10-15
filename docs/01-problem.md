# 01 — The problem

Grounded in `app/surgical-assessment/page.tsx` (the `AI_DESCRIPTION` block that
ships with the page) and the module layout in `app/`.

## Where the problem shows up

Someone managing a long-term condition accumulates health records across
scattered places: paper lab printouts, PDF reports emailed from a clinic, visit
summaries that nobody keeps after the appointment. Over time the useful
question — *is my health good enough that surgery is safe, and if not, what
should I fix first?* — becomes unanswerable without re-reading everything.

Three concrete gaps the app is built against:

1. **Records are fragmented.** Lab results, visit history and medications live
   in separate systems, so no single view exists. The dashboard
   (`components/dashboard/HealthSummary.tsx`, `TestResults.tsx`,
   `UpcomingAppointments.tsx`) exists to put them on one screen.
2. **Historical PDFs are unreadable.** A stack of scanned reports cannot be
   queried. `app/reports/*` uploads a file, sends it to Gemini
   (`gemini-pro-vision`, `app/api/analyze-reports/route.ts`) and files the
   extracted result back into Supabase Storage.
3. **Readiness is not tracked over time.** `app/surgical-assessment` takes the
   recorded markers and derives cardiac, pulmonary, haematological and
   metabolic scores, so readiness becomes a number that moves rather than a
   judgement made fresh at each consultation. `SurgicalTimeline.tsx` exists to
   show that movement.

## Who it is for

One person tracking their own records. The middleware
(`middleware.ts`) protects every route except the auth pages, and the data model
is four tables keyed to a single profile — there is no clinician, admin or
care-team role anywhere in the schema.

## Non-goals

The scoring is heuristic. `types/surgical-markers.ts` supplies
`SCORE_WEIGHTS` and `NORMAL_RANGES`; `utils/calculateSurgicalScores.ts`
normalises each marker to a 0–1 score and
`utils/calculateRiskScores.ts` rolls them up. Nothing in the repository
validates those ranges against clinical literature, and no test covers them.
The app assists record-keeping; it does not give medical advice.