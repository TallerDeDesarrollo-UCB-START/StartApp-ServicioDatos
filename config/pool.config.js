const Pool = require("pg").Pool;
require('dotenv').config()

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD, //use your pass my friend
  database: process.env.DB_HOST,
  host: process.env.DB_DATABASE,
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports.pool = pool;