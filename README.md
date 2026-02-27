# HiTest Platform (MVP)

Self-hosted, Prolific-friendly usability testing platform built with Next.js App Router, Prisma/Postgres, and Tailwind.

## Features
- Publish tests that point to GitHub Pages prototypes.
- Enforce Prolific query params (PROLIFIC_PID, STUDY_ID, SESSION_ID) and prevent duplicate submissions per test.
- Task timing with min time per task, focus/blur count, and total duration flagging.
- Structured follow-up questions (text, textarea, multiple choice, 1–5 scale).
- Admin panel (password) to create/publish tests, manage tasks/questions, view submissions, and export CSV.
- CSV export includes task durations/blur counts, answers, total time, and Prolific IDs.
- Basic in-memory rate limiting for API routes.

## Getting Started
1. Install deps (requires internet):
   ```bash
   npm install
   ```
2. Configure env vars (copy `.env.example` to `.env.local`):
   - `DATABASE_URL=postgresql://user:password@host:5432/hitest`
   - `ADMIN_PASSWORD=your_admin_password`
   - `ADMIN_SECRET` (optional HMAC secret; falls back to ADMIN_PASSWORD)
   - `NEXT_PUBLIC_APP_URL` (e.g., `https://your-domain.com` or `http://localhost:3000`)
3. Set up database schema:
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```
4. Run dev server:
   ```bash
   npm run dev
   ```

## Deploying
- Works on Vercel or any Node host. Ensure `DATABASE_URL`, `ADMIN_PASSWORD`, and `NEXT_PUBLIC_APP_URL` are set in environment.
- For Supabase, use the generated connection string as `DATABASE_URL`.

## Usage
- Admin login: `/admin/login` with `ADMIN_PASSWORD`.
- Admin panel: `/admin` — create/edit tests, tasks, questions, and publish.
- Participant link template (per test):
  ```
  {NEXT_PUBLIC_APP_URL}/test/{testId}?PROLIFIC_PID=<PID>&STUDY_ID=<STUDY_ID>&SESSION_ID=<SESSION_ID>
  ```
- Completion redirects to Prolific: `https://app.prolific.com/submissions/complete?cc=<completionCode>`.

## Notes / Constraints
- In-memory rate limiting resets on server restart; for production, back with Redis or similar.
- Admin auth is cookie-based HMAC; rotate `ADMIN_SECRET` to invalidate sessions.
- No Prolific API automation; links are manual as requested.
- X-Frame headers are not set so GitHub Pages embeds load in iframe.
