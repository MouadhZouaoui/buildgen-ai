# BuildGen AI frontend

## Run locally

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
3. Run `npm run dev`.

Use the Supabase project's **anon/publishable key** only. Never put its service-role key in a `VITE_*` variable or in frontend code.

## Supabase requirements

- Storage bucket: `building-documents`.
- `public.buildings` must contain `id`, `name`, `pdf_path`, `status`, and `building_json`.
- Allow the anon role to upload objects to `building-documents` and insert rows into `buildings`.
- Enable Realtime for `public.buildings`; allow the anon role to read the row updates needed for the active project.
- The Colab worker uses its service-role key and must be able to read uploaded objects and update `buildings`.

The browser uploads a PDF to `pdfs/<uuid>.pdf`, inserts its `buildings` row with status `uploaded`, and listens for status updates. `processing` keeps the progress indicator active, `completed` maps the generated levels and rooms into the 3D viewer, and `error` displays the worker's error. Supabase setup and policies are managed separately from this frontend.
