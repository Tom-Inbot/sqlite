const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const url = require("url");
const { jwtDecode } = require("jwt-decode");
const getAuthRouter = require("./routes/getAuthRoute.js");
const submitTokenRouter = require("./routes/getTokenRoute.js");
const thirdRouter = require("./routes/submitTokenRoute.js");

app.use(bodyParser.json());
app.use("/", getAuthRouter);
app.use("/", submitTokenRouter);
app.use("/", thirdRouter);

app.listen(3000);