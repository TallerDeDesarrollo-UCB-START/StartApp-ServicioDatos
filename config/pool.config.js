const Pool = require("pg").Pool;

const pool = new Pool({
  user: "pvsifhkgosgqog",
  password: "afddd3387a8c58046f43d51b8a7bb0a110a5a940e6ad45afe210b4576ac4c9da", //use your pass my friend
  database: "db389gkd6ou7j1",
  host: "ec2-44-194-4-127.compute-1.amazonaws.com",
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
});



module.exports.pool = pool;
