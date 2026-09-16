const { Pool } = require("pg");

const databaseUrl = process.env.DATABASE_URL;
const neonHostAddr = process.env.NEON_HOSTADDR;

let poolConfig;

if (databaseUrl) {
  const url = new URL(databaseUrl);

  poolConfig = {
    host: neonHostAddr || url.hostname,
    port: Number(url.port || 5432),
    database: decodeURIComponent(url.pathname.replace(/^\//, "")),
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),

    ssl: {
      rejectUnauthorized: false,
      ...(neonHostAddr
        ? {
            servername: url.hostname,
          }
        : {}),
    },

    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  };
} else {
  poolConfig = {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 5432),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,

    ssl:
      process.env.NODE_ENV === "production"
        ? {
            rejectUnauthorized: false,
          }
        : false,

    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  };
}

const pool = new Pool(poolConfig);

pool.on("error", (err) => {
  console.error("Unexpected PostgreSQL pool error:", err);
});

module.exports = pool;
