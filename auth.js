module.exports = function (app) {

    app.post("/signin", (req, res) => {
        res.send("test")
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