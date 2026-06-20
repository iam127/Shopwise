const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.DB_HOST && process.env.DB_HOST.includes('render.com')
    ? { rejectUnauthorized: false }
    : false,
});

pool.connect()
  .then(() => console.log('Conectado a PostgreSQL ✅'))
  .catch((err) => console.error('Error al conectar a PostgreSQL ❌', err));

module.exports = pool;