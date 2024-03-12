const sqlite = require("sqlite3").verbose();
const db = new sqlite.Database("./quote.db", sqlite.OPEN_READWRITE, (err) => {
  if (err) return console.error(err.message);
});

const sql =
  "CREATE TABLE tokens(ID INTEGER PRIMARY KEY, refresh_token, id_token, created_on, updated_on, name, email)";
db.run(sql);