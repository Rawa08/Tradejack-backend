const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.HOST_SQL,
    user: process.env.USER_SQL,
    password: process.env.PASSWORD_SQL,
    port: process.env.PORT_SQL,
    database: process.env.DB_SQL,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    ssl: {
      rejectUnauthorized: false
    }
  });


  module.exports = pool;