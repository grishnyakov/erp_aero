const express = require("express");

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
require("./database")();

const port = 8000;
app.listen(port, function () {
    console.log("server started", "http://localhost:"+port)
})