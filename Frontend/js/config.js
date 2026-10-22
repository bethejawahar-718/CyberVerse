// Centralized backend API location for every page.
//
// Local dev: the backend runs on http://localhost:5000, started with
// `npm run dev` inside Backend/.
//
// Production: after you deploy the backend (e.g. to Vercel), replace
// PRODUCTION_API_BASE_URL below with that deployment's URL + "/api".
const PRODUCTION_API_BASE_URL = "https://cyberverse-backend.vercel.app/api";

window.CYBERVERSE_API_BASE_URL = (function () {
    const { hostname } = window.location;
    const isLocal = hostname === "localhost" || hostname === "127.0.0.1" || hostname === "";
    return isLocal ? "http://localhost:5000/api" : PRODUCTION_API_BASE_URL;
})();
