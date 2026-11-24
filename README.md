# Mulama Super Cup Portal

A React + Vite + Tailwind portal for the Mulama Super Cup 5th Edition.

## Cloudflare Pages deployment

- Framework preset: **None**
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: leave blank
- Node version: use Node.js 20 or 22

Cloudflare installs the dependencies from `package.json` automatically.

## Supabase configuration

The portal uses Supabase Auth and a `portal_records` table. In Cloudflare Pages, open **Settings → Environment variables** and add:

- `VITE_SUPABASE_URL` — your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — your Supabase anon/public key

Redeploy after adding or changing environment variables. The Supabase project must also have the `portal_records` table and suitable Row Level Security policies configured. Do not put a Supabase service-role key in frontend environment variables.

## Project structure

- `src/App.tsx` — portal application
- `src/main.tsx` — React entry point
- `src/index.css` — portal styling
- `src/tailwind.css` — Tailwind directives
- `index.html` — Vite page entry
