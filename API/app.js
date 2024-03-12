const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const url = require("url");
const { jwtDecode } = require("jwt-decode");

let sql;

const sqlite = require("sqlite3").verbose();
const db = new sqlite.Database("./quote.db", sqlite.OPEN_READWRITE, (err) => {
  if (err) return console.error(err.message);
});

app.use(bodyParser.json());

// POST Request
app.post("/googleapi/subirtoken", (req, res) => {
  try {
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
        console.log("Sucessful Input ", refresh_token, id_token);
      }
    );
    res.json({
      status: 200,
      sucess: true,
    });
  } catch (error) {
    return res.json({
      status: 400,
      sucess: false,
    });
  }
});

// GET Request
app.get("/googleapi/gettoken", (req, res) => {
  sql = "SELECT * FROM tokens";
  try {
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
    return res.json;
  }
});

app.listen(3000);
