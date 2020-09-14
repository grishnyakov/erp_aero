const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();

const cors = require('cors')
app.use(cors({
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
}));

app.get("/", (req, res) => {
    res.send("test")
});

require("./auth")(app);
require("./files")(app);

const port = 8000;
app.listen(port, function () {
    console.log("server started", "http://localhost:"+port)
})