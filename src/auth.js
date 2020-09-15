const jwt = require("jsonwebtoken");
const users = require("./users");

const ACCESS_SECRET = "aero-key";
const REFRESH_SECRET = "e8n(*&^nfdnf6SAFMPQZMGVFJA"


function verifyToken (req, res, next) {
    // нет требований по месту хранения токенов, поэтому буду в куках хранить
    if (!req.cookies.accessToken) res.sendStatus(403);
    else {
        jwt.verify(req.cookies.accessToken, ACCESS_SECRET, (err, authData) => {
            if (err) res.sendStatus(403);
            else {
                if (authData.user.id === null) res.sendStatus(403); // anonimus
                else {
                    req.authData = authData;
                    next()
                }
            }
        });
    }
}

function getToken (user, type = "access",) {
    const isRefreshToken = type === "refresh";
    const options = {
        user,
        expiresIn: isRefreshToken ? "30 days" : "10m"
    };
    const token = isRefreshToken ? REFRESH_SECRET : ACCESS_SECRET;
    return new Promise((resolve) => {
        jwt.sign(options, token, (err, token) => {
            if (err) throw new Error(err.message || "undefined err: getToken");
            else resolve(token);
        });
    })
}

function setCookieTokens (res, accessToken, refreshToken) {
    res.cookie('accessToken', accessToken, { httpOnly: true });
    res.cookie('refreshToken', refreshToken, { httpOnly: true });
}

async function updatePairTokens (user, res) {
    setCookieTokens(res, await getToken(user), await getToken(user, "refresh"));
    res.sendStatus(204);
}

module.exports = {
    init (app) {
        app.post("/signin", (req, res) => {
            const user = users.getUser(req.body);
            updatePairTokens(user, res);
        });
        app.post("/signin/new_token", (req, res) => {
            jwt.verify(req.cookies.refreshToken, REFRESH_SECRET, (err, authData) => {
                if (err) res.sendStatus(403);
                else updatePairTokens(authData.user, res);
            })
        });
        app.post("/signup", (req, res) => {
            users.register(req.body, res);
        });

        // возвращает id пользователя;
        app.get("/info", verifyToken, (req, res) => {
            res.json(req.authData.user.id)
        });
        app.get("/logout", verifyToken, (req, res) => {
            updatePairTokens({ id: null }, res);
        });

        return app;
    },
    verifyToken
}