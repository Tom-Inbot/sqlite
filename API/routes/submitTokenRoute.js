const express = require("express");
const router = express.Router();
const { checkAuthentication } = require("../utils.js");

router.post("/googleapi/subirtoken", async (req, res) => {
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
    });
  } catch (error) {
    return res.json({
      status: 400,
      sucess: false,
    });
  }
});

module.exports = router;
