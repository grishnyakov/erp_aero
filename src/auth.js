const jwt = require("jsonwebtoken");


module.exports = function (app) {

    app.post("/signin", (req, res) => {
        const token = jwt.sign({ data: 'user_id', expiresIn: "10m" }, 'aero-key');
        res.json({ token })
    });
    app.post("/signin/new_token", (req, res) => {
        res.send("test")
    });
    app.post("/signup", (req, res) => {
        res.send("test")
    });

    // возвращает id пользователя;
    app.get("/info", (req, res) => {
        res.send("test")
    });

    app.get("/logout", (req, res) => {

    });

    return app;
}