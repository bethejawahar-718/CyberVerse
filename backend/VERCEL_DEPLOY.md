# Deploy CyberVerse on Vercel

## Deploy

1. Extract this folder.
2. Push the contents of this folder to a GitHub repository.
3. In Vercel, choose **Add New → Project**, import that repository, and keep the **Root Directory** as `./`.
4. Vercel should detect the project. There is no build command required for the static HTML frontend; the API is served by `api/index.js`.
5. In Vercel Project → Settings → Environment Variables, add:
   - `JWT_SECRET`: a long random value of at least 32 characters
   - `FRONTEND_ORIGIN`: the deployed site origin, e.g. `https://your-project.vercel.app`
6. Deploy. After deployment, open `https://YOUR-PROJECT.vercel.app/api/health`.

## Important limitations before public use

- **The current frontend JavaScript has been kept unchanged.** Its login and registration handlers use browser `localStorage`, not the API. So deploying this project does not automatically connect the existing forms to the backend.
- **The current JSON-file backend store is not persistent on Vercel.** Serverless function filesystems are ephemeral; user accounts and progress stored in `backend/data/db.json` can disappear and should not be relied on. For real accounts, connect a persistent database such as Neon Postgres or Supabase and move users/progress/lab completions into database tables.
- The mentor route is a built-in demo response, not a real AI model integration.
- Do not use this JSON-store version for production accounts or sensitive data.

## Frontend

The HTML files are at the project root, with `css/` and `js/` unchanged from the supplied frontend. The `vercel.json` rewrite sends `/api/*` requests to the Express serverless function.
