const Pool = require("pg").Pool;
require('dotenv').config();


console.log(process.env.DB_USER);
console.log(process.env.DB_USER);
console.log(process.env.DB_USER);
console.log(process.env.DB_USER);

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD, //use your pass my friend
  database: process.env.DB_HOST,
  host: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false,
  },

});

module.exports.pool = pool;

