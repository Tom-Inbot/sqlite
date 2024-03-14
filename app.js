const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const url = require("url");
const { jwtDecode } = require("jwt-decode");
const cors = require("cors");

const sqlite = require("sqlite3").verbose();
const db = new sqlite.Database(
  "./database/token.db",
  sqlite.OPEN_READWRITE,
  (err) => {
    if (err) return console.error(err.message);
  }
);

let sql;

// Functions
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
app.use(
  cors({
    origin: "*",
  })
);

app.use(bodyParser.json());
// Get Token (Use after submitting)
app.get("/googleapi/getauth", (req, res) => {
  try {
    let sql = "SELECT id, authtoken FROM auth WHERE id = ?";
    const id = 1;
    let code = ".";

    db.all(sql, [id], (err, row) => {
      if (err) return console.error(err.message);
      code =
        row[0] === undefined || row[0].authtoken === undefined ? false : true;
      if (code) {
        res.json({
          status: 300,
          sucess: false,
          message: "Authtoken already created in Database",
        });
      } else {
        sql = "INSERT INTO auth(authtoken) VALUES (?)";
        const authtoken = generateRandomString();
        db.run(sql, [authtoken], (err) => {
          if (err) return res.json({ status: 300, success: false, error: err });
          console.log("Sucessful Authtoken Creation");
        });
        res.json({
          status: 200,
          sucess: true,
          message: "",
          token: authtoken,
        });
      }
    });
  } catch (error) {
    return res.json({
      status: 400,
      sucess: false,
    });
  }
});

// POST Request
app.post("/googleapi/subirtoken", async (req, res) => {
  try {
    const auth = await checkAuthentication(req);
    if (!auth) {
      return res.json({
        status: 400,
        sucess: false,
        message: "Invalid/No auth token",
      });
    }
    const { refresh_token, id_token } = req.body;
    const decoded = jwtDecode(id_token);
    const created_on = new Date().toLocaleString();
    sql =
      "INSERT INTO tokens(refresh_token,id_token,created_on,name,email) VALUES (?,?,?,?,?)";
    db.run(
      sql,
      [refresh_token, id_token, created_on, decoded.name, decoded.email],
      (err) => {
        if (err) return res.json({ status: 300, success: false, error: err });
        console.log("Sucessful Input");
      }
    );
    res.json({
      status: 200,
      sucess: true,
      email: decoded.email,
    });
  } catch (error) {
    return res.json({
      status: 400,
      sucess: false,
    });
  }
});

app.get("/googleapi/gettoken", async (req, res) => {
  let sql = "SELECT * FROM tokens";
  try {
    const auth = await checkAuthentication(req);
    if (!auth) {
      return res.json({
        status: 400,
        success: false,
        message: "Invalid Token",
      });
    }
    const queryObject = url.parse(req.url, true).query; // Query Parameters
    if (queryObject.field && queryObject.type) {
      sql += ` WHERE ${queryObject.field} LIKE '%${queryObject.type}%'`;
    }
    db.all(sql, [], (err, rows) => {
      if (err) return res.json({ status: 300, success: false, error: err });

      if (rows.length < 1)
        return res.json({ status: 300, success: false, error: "No match" });

      return res.json({ status: 200, data: rows, success: true });
    });
  } catch (error) {
    return res.json({ status: 500, success: false, error: error.message });
  }
});

app.delete("/googleapi/delete", async (req, res) => {
  try {
    const auth = await checkAuthentication(req);
    if (!auth) {
      return res.json({
        status: 400,
        success: false,
        message: "Invalid Token",
      });
    }
    sql = "DELETE FROM tokens WHERE id=?";
    const queryObject = url.parse(req.url, true).query; // Query Parameters
    if (!queryObject.id) {
      return res.json({
        status: 400,
        success: false,
        message: "Query Param id invalid",
      });
    }
    db.run(sql, [queryObject.id], (err) => {
      if (err) return res.json({ status: 300, success: false, error: err });
      return res.json({ status: 200, message: `Id ${queryObject.id} has been deleted`, success: true });
    });
  } catch (error) {
    return res.json({ status: 500, success: false, error: error.message });
  }
});

app.listen(3000, () => {
  console.log("I'm listening...");
});
