const mysql = require("mysql2/promise");
const pool = mysql.createPool({
  host: "localhost",
  port: 8889,
  user: "root",
  password: "root",
  database: "db_01",
});
module.exports = pool; 