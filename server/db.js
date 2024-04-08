const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: "Viking2002",
  host: "localhost",
  port: 5432,
  database: "sjekkminhybeldb",
  client_encoding: 'utf8'  // Enforce UTF-8 encoding
});

module.exports = pool;
