# Mulama Super Cup Tournament Portal

A React + TypeScript + Vite portal prepared for Cloudflare Pages, with Supabase for tournament records and administrator authentication.

## Included improvements

- Reusable Vite project structure and production build setup.
- Supabase-backed records adapter replacing the unavailable platform-specific `actions` endpoint.
- Supabase email/password administrator sign-in (the old hard-coded demo PIN was removed).
- Row Level Security: public visitors can read tournament data and submit team registrations; authenticated users can manage records.
- Preserves the supplied tournament UI, teams, fixture logic, poster and prize information.
- Cloudflare Pages SPA fallback.

## 1. Configure Supabase

1. Open your Supabase project.
2. Go to **SQL Editor → New query**.
3. Paste and run `supabase-setup.sql`.
4. Go to **Authentication → Users → Add user** and create the administrator email/password. Do not enable public sign-ups for administrator accounts.
5. Copy the project URL and publishable/anon key from **Project Settings → API**.

## 2. Run locally

```bash
cp .env.example .env.local
# Edit .env.local with your Supabase project URL and publishable/anon key
npm install
npm run dev
```

## 3. Deploy to Cloudflare Pages (free plan)

1. Push this folder to a GitHub repository.
2. In Cloudflare Dashboard, open **Workers & Pages → Create → Pages → Connect to Git**.
3. Select the repository.
4. Set build command to `npm run build` and build output directory to `dist`.
5. Add these environment variables under the Pages project settings (Production, and Preview if needed):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Deploy. Cloudflare will provide a `*.pages.dev` address.

## Security notes

- Never put the Supabase `service_role` key in this website or any `VITE_` variable.
- Supabase Row Level Security is enabled by the SQL script. Anonymous inserts are restricted to the `registrations` collection; updates/deletes and other inserts require a signed-in Supabase user.
- Create administrator accounts yourself in Supabase Authentication. Do not expose admin account creation to public visitors.
- The browser uses the Supabase publishable/anon key, which is designed to be public when RLS is correctly configured.

## Important deployment validation

The source archive contained only `App.tsx`, `index.css`, and the poster image. It did not include the original platform backend, package manifest, or a complete project scaffold. This package supplies a Vite scaffold and a Supabase records adapter to replace that missing backend. Before using it for a live competition, test public registration, administrator sign-in, match result entry, fixture updates, player records and standings in a Supabase-connected preview.
