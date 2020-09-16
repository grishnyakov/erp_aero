const { verifyToken } = require("./tokens")
const fileUpload = require('express-fileupload');
const path = require("path");
const fs = require('fs');
// const helmet = require("helmet"); // TODO настроить безопасность
const db = require("./database");

const fileFolder = path.join(__dirname, '../files');

function saveFile (req, res) {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    const sampleFile = req.files.sampleFile;
    const fileName = req.params.id || sampleFile.name;

    sampleFile.mv(path.join(fileFolder, fileName), function (err) {
        if (err)
            return res.status(500).send(err);

        res.send('File uploaded!');
    });
}


module.exports = function (app) {
    // app.use("/file*", verifyToken); // пока нет теста, который сможет проходить авторизацию, отключаю

    // что успел сделать
    app.use(["/file/upload", "/file/update/:id"], fileUpload({
        useTempFiles: true,
        createParentPath: true,
        tempFileDir: '/tempFiles/'
    }));
    app.post("/file/upload", (req, res) => {
        saveFile(req, res);
    });
    app.put("/file/update/:id", (req, res) => {
        saveFile(req, res);
    });
    app.delete("/file/delete/:id", (req, res) => {
        const fullPath = path.join(fileFolder, req.params.id)

        fs.unlinkSync(fullPath);
        res.sendStatus(204)
    });
    app.get("/file/download/:id", (req, res) => {
        const fullPath = path.join(fileFolder, req.params.id)
        if (fs.existsSync(fullPath)) {
            res.sendFile(fullPath)
        } else res.sendStatus(404);
    });


    // TODO: нужны запросы в бд - рутинная работа, не буду тратить время
    app.get("/file/:id", (req, res) => {
        res.send("test");
    });
    app.get("/file/list", (req, res) => {
        // TODO: запрос в БД на список файлов,
        res.send("test")
    });
    return app;
}