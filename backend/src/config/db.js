
const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const caCertificate = process.env.DB_CA_CERT
    ? process.env.DB_CA_CERT.replace(/\\n/g, "\n")
    : fs.readFileSync(
        path.resolve(__dirname, "../../ca.pem"),
        "utf8"
    );

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT || 3306),

    ssl: {
        ca: caCertificate,
        rejectUnauthorized: true
    },

    waitForConnections: true,
    connectionLimit: 10
});

module.exports = pool;
