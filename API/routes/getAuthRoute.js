const express = require("express");
const router = express.Router();
const { generateRandomString } = require("../utils.js");

router.get("/googleapi/getauth", (req, res) => {
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
          message: authtoken,
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

module.exports = router;
