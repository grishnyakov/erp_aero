const jwt = require("jsonwebtoken");
const users = require("./users");

const ACCESS_SECRET = "b32b7%#_erp-aero-DD";
const REFRESH_SECRET = "e8n(*&^nfdn_f6SA"


function verifyToken (req, res, next) {

    if (!req.cookies.accessToken) res.sendStatus(403);
    else {
        jwt.verify(req.cookies.accessToken, ACCESS_SECRET, (err, authData) => {
            if (err) {
                if (err.name === "TokenExpiredError") res.status(403).send(err.message); // TODO: автоматически продлевать
                else res.sendStatus(403);
            }
            else {
                if (authData.userID === null) res.sendStatus(403); // anonimus
                else if (!users.isAuthorized(authData.userID)) res.sendStatus(403); // anonimus
                else {
                    req.authData = authData;
                    next()
                }
            }
        });
    }
}

function getToken (userID, type = "access",) {
    const isRefreshToken = type === "refresh";
    const options = { expiresIn: isRefreshToken ? "30 days" : "30s" };
    const secret = isRefreshToken ? REFRESH_SECRET : ACCESS_SECRET;

    return new Promise((resolve) => {
        jwt.sign({ userID }, secret, options, (err, token) => {
            if (err) throw new Error(err.message || "undefined err: getToken");
            else resolve(token);
        });
    })
}


async function returnPairTokens (userID, res) {
    const accessToken = await getToken(userID);
    const refreshToken = await getToken(userID, "refresh");

    users.setToken(userID, refreshToken);

    res.json({
        accessToken,
        refreshToken,
    });
}

module.exports = {
    init (app) {
        app.post("/signin", (req, res) => {
            users.getUser(req.body, (err, userID) => {
                if (!err) returnPairTokens(userID, res);
                else res.status(403).json(err);
            });
        });
        app.post("/signin/new_token", (req, res) => {
            jwt.verify(req.body.refreshToken, REFRESH_SECRET, (err, { userID }) => {
                if (err) res.sendStatus(403);
                else if (!users.checkToken(userID, req.body.refreshToken)) res.sendStatus(403);
                else returnPairTokens(userID, res);
            })
        });
        app.post("/signup", (req, res) => {
            users.register(req.body, (err, userID) => {
                if (err) res.sendStatus(403);
                else returnPairTokens(userID, res);
            });
        });

        // возвращает id пользователя;
        app.get("/info", verifyToken, (req, res) => {
            res.json(req.authData.userID)
        });
        app.get("/logout", verifyToken, (req, res) => {
            //TODO: нужно деактивация access token'а

            users.removeToken(req.authData.userID); // refresh token контролируем
            returnPairTokens({ id: null }, res);
        });

        return app;
    },
    verifyToken
}