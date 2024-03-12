const sqlite = require("sqlite3").verbose();
const db = new sqlite.Database(
  "./database/token.db",
  sqlite.OPEN_READWRITE,
  (err) => {
    if (err) return console.error(err.message);
  }
);

function checkAuthentication(req) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT id, authtoken FROM auth WHERE id = ?";
    const id = 1;
    const token = req.header("x-auth-token");
    if (!token) resolve(false);

    db.all(sql, [id], (err, row) => {
      if (err) reject(err.message);
      const code =
        row[0] === undefined || row[0].authtoken === undefined
          ? false
          : row[0].authtoken;
      if (token == code) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}

function generateRandomString() {
  let chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  for (let i = 32; i > 0; --i) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

module.exports = { checkAuthentication, generateRandomString };
