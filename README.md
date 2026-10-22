# CyberVerse

A cybersecurity-learning platform: static HTML/CSS/JS frontend + an Express/MySQL backend API (auth, user profile, lessons).

## Structure

- `Frontend/` — static site (no build step). Pages call the backend through `Frontend/js/config.js`, which points at `http://localhost:5000/api` locally and at a configurable production URL otherwise.
- `Backend/` — Express API. `server.js` exports the app; `api/index.js` re-exports it for Vercel's serverless runtime. `schema.sql` has the MySQL tables it expects.

## Local development

**Backend**

```bash
cd Backend
cp .env.example .env     # fill in your local MySQL creds + a JWT secret
npm install
mysql -u root -p cyberverse < schema.sql   # create tables (create the DB first if needed)
npm run dev               # http://localhost:5000
```

**Frontend**

Open `Frontend/index.html` with any static file server (e.g. `npx serve Frontend`), or just open the files directly in a browser. It will call the backend at `http://localhost:5000/api` automatically when running on localhost.

## Deploying

Two separate Vercel projects:

1. **Backend** — import this repo into Vercel with root directory `Backend/`. Add environment variables `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`, `DB_SSL`, `JWT_SECRET` (pointing at a hosted MySQL instance — `localhost` only works for local dev). Run `schema.sql` against that hosted database once.
2. **Frontend** — import this repo again with root directory `Frontend/`. After the backend is deployed, update `PRODUCTION_API_BASE_URL` in `Frontend/js/config.js` to the backend's deployed URL (e.g. `https://cyberverse-backend.vercel.app/api`) and redeploy.
