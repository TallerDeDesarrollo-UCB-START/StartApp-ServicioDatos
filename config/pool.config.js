const Pool = require("pg").Pool;

const pool = new Pool({
  user: process.env.DEV_USER,
  password: process.env.DEV_PASSWORD, //use your pass my friend
  database: process.env.DEV_DATABASE,
  host: process.env.DEV_HOST,
  port: process.env.PORT,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports.pool = pool;