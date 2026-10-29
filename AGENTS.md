# AGENTS.md

- Session generation lives in `src/lib/sessionGenerator.ts` as pure functions with tests in `sessionGenerator.test.ts`; why: timing rules (phases sum to session length) must stay testable.
- Saved sessions persist in the `training_sessions` table; signed-out users get a sessionStorage draft at `/session/draft`; why: refresh/back must never lose work.
- Inputs store raw text; validate with Zod on submit and never sanitise on change or transform passwords/emails; why: on-change sanitising broke typing spaces.
- Pages are react-router routes (`/`, `/plan`, `/session/:id`, `/session/:id/print`, `/library`, `/account`); why: real back/refresh/share links.
- Legacy `supabase/migrations/` are from the old external backend; schema changes now go through Drizzle migrations; why: project runs on Lovable Cloud.
- AI sessions come from the `generate-session` edge function with service-only atomic usage reservations and server validation; client normalisation preserves timing and rejects unsafe young-age plans; why: concurrent requests and unsafe model output must not bypass the rules.
- Delivery rules live in `src/lib/delivery.ts`, with wall-clock countdowns in `useCountdown`; why: adjustments preserve all other practices and timing, and background tabs must not delay countdowns.
- Phase 3 routes are `/session/:id/coach`, `/sessions` and `/block`; blocks save individual sessions using existing plan JSONB rather than a second activities source; why: all edits, sharing and exports read the same canonical plan.
- Single-practice adjustment uses the existing rate-limited edge function's `adjust` action; why: AI secrets and safety checks stay server-side and failure leaves the original unchanged.
- Diagrams render canonical activity coordinates, never guessed layouts based on names; why: coaches must not see misleading player arrangements.
- The home route is a recent-session workspace using WorkspaceNav; why: daily coaching work takes priority over marketing.
- Password checks are pure shared functions, with a dedicated recovery route; why: signup and reset must enforce consistent requirements.
