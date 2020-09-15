const express = require("express");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require("path");
const app = express();

const cors = require('cors')
app.use(cors({
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
}));

app.use(bodyParser.json())
app.use(cookieParser());

require("./src/database");
require("./src/auth").init(app);
require("./src/files")(app);

app.get("/", (req, res)=>{
    res.sendFile("index.html",{ root: path.join(__dirname, 'public') })
});


const port = 8000;
app.listen(port, function () {
    console.log("server started", "http://localhost:"+port)
})