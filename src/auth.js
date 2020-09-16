const users = require("./users");
const tokens = require("./tokens");

module.exports = {
    init (app) {
        app.post("/signin", (req, res) => {
            users.getUser(req.body, (err, userID) => {
                if (!err) tokens.returnPairTokens(userID, res);
                else res.status(403).json(err);
            });
        });
        app.post("/signin/new_token", (req, res) => {
            tokens.verifyRefreshToken(req.body.refreshToken, (err, authData) => {
                if (err) res.sendStatus(err.code || 403);
                else {
                    tokens.revokeRefreshToken(req.body.refreshToken);
                    tokens.returnPairTokens(authData.userID, res);
                }
            })
        });
        app.post("/signup", (req, res) => {
            users.register(req.body, (err, userID) => {
                if (err) res.sendStatus(403);
                else tokens.returnPairTokens(userID, res);
            });
        });

        // возвращает id пользователя;
        app.get("/info", tokens.verifyToken, (req, res) => {
            res.json(req.authData.userID)
        });
        app.get("/logout", tokens.verifyToken, (req, res) => {
            tokens.verifyRefreshToken(req.cookies.refreshToken, (err, authData) => {
                if (err) res.sendStatus(err.code || 403);
                else {
                    tokens.revokeRefreshToken(req.cookies.refreshToken); // в GET запросе нет тела, поэтому помещаем в куки refreshToken 
                    tokens.returnPairTokens({ id: null }, res);
                }
            })
        });

        return app;
    },
}