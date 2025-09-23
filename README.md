# ChAPPerone (Next.js + Supabase)

"You don't have to walk alone" — Oakland pilot (94610 & 94611)

## Quick start
1. Copy `.env.example` to `.env.local` and fill in Supabase values.
2. `npm install`
3. `npm run dev`
4. Visit http://localhost:3000

## Deploy (Vercel)
- Import this repo.
- Add env vars from `.env.example` to Vercel Project → Settings → Environment.
- Deploy; you'll get a `https://<project>.vercel.app` URL.

## Supabase setup
Run the SQL in `/supabase/schema.sql` once (Supabase → SQL Editor). Enable Email OTP (Auth → Providers → Email).

## Notes
- Desktop-first UI; map-first flow; in-app chat (MVP); volunteer-only.
- Pilot: pickup must be inside 94610 or 94611; walk time cap 20 minutes.
