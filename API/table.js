const sqlite = require("sqlite3").verbose();
const db = new sqlite.Database(
  "./database/token.db",
  sqlite.OPEN_READWRITE,
  (err) => {
    if (err) return console.error(err.message);
  }
);
sql = "DELETE FROM tokens WHERE id=?";
db.run(sql, [1], (err) => {
  if (err) return console.error(err.message);
});

/*
// Create Auth Table
const sql = "CREATE TABLE auth(ID INTEGER PRIMARY KEY, authtoken)";
db.run(sql);

// Create Token Table
const sql =
  "CREATE TABLE tokens(ID INTEGER PRIMARY KEY, refresh_token, id_token, created_on, updated_on, name, email)";
db.run(sql);
*/
