# AGENTS.md

- Session generation lives in `src/lib/sessionGenerator.ts` as pure functions with tests in `sessionGenerator.test.ts`; why: timing rules (phases sum to session length) must stay testable.
- Saved sessions persist in the `training_sessions` table; signed-out users get a sessionStorage draft at `/session/draft`; why: refresh/back must never lose work.
- Inputs store raw text; validate with Zod on submit and never sanitise on change or transform passwords/emails; why: on-change sanitising broke typing spaces.
- Pages are react-router routes (`/`, `/plan`, `/session/:id`, `/session/:id/print`, `/library`, `/account`); why: real back/refresh/share links.
- Legacy `supabase/migrations/` are from the old external backend; schema changes now go through Drizzle migrations; why: project runs on Lovable Cloud.
