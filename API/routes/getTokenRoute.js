const express = require("express");
const router = express.Router();
const { checkAuthentication } = require("../utils.js");

router.get("/googleapi/gettoken", async (req, res) => {
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

module.exports = router;
