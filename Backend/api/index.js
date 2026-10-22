// Vercel serverless entry point. Vercel builds every file under api/ as its
// own function; this one just re-exports the existing Express app from
// server.js (server.js only calls app.listen() when run directly, so this is
// safe to import here).
module.exports = require("../server");
