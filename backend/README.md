# CyberVerse — Vercel deployment package

The supplied frontend is at the project root. CSS and JS files were copied without changing their contents. `api/index.js` exposes the Express API as a Vercel serverless function.

Read `VERCEL_DEPLOY.md` before deploying. In particular, the current JSON-file store is not durable on Vercel and the existing frontend auth JavaScript is not connected to the API yet.
