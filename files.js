module.exports = function (app) {

    app.post("/file/upload", (req, res) => {
        res.send("test")
    });
    app.get("/file/list", (req, res) => {
        res.send("test")
    });
    app.delete("/file/delete/:id", (req, res) => {
        res.send("test")
    });
    app.get("/file/:id", (req, res) => {
        res.send("test")
    });
    app.get("/file/download/:id", (req, res) => {
        res.send("test")
    });
    app.get("/file/update/:id", (req, res) => {
        res.send("test")
    });
    
    
    return app;
}