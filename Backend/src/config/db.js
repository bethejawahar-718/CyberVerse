const mysql = require("mysql2/promise");
require("dotenv").config();

// Most hosted MySQL providers (Aiven, PlanetScale via MySQL protocol,
// Clever Cloud, etc.) require TLS. Set DB_SSL=true in that environment's
// variables to turn it on; local dev leaves it unset/off.
const useSSL = String(process.env.DB_SSL).toLowerCase() === "true";

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    // Serverless functions spin up many short-lived instances, each with its
    // own pool, so keep per-instance limits small to avoid exhausting the
    // database's total connection limit.
    connectionLimit: 5,
    ssl: useSSL ? { rejectUnauthorized: true } : undefined
});

module.exports = pool;