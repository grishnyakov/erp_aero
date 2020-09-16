const jwt = require("jsonwebtoken");
const ACCESS_SECRET = "b32b7%#_erp-aero-DD";
const REFRESH_SECRET = "e8n(*&^nfdn_f6SA"

// велосипед конечно, но что вы хотели за такое время
let refreshTokens = [];

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
                else {
                    req.authData = authData;
                    next()
                }
            }
        });
    }
}
function getToken (userID, type = "access",) {
    return new Promise((resolve) => {
        const isRefreshToken = type === "refresh";
        const options = { expiresIn: isRefreshToken ? "30 days" : "10m" };
        const secret = isRefreshToken ? REFRESH_SECRET : ACCESS_SECRET;

        jwt.sign({ userID }, secret, options, (err, token) => {
            if (err) throw new Error(err.message || "undefined err: getToken");
            else {
                if (isRefreshToken) refreshTokens.push(token);
                resolve(token);
            }
        });
    })
}
async function returnPairTokens (userID, res) {
    const accessToken = await getToken(userID);
    const refreshToken = await getToken(userID, "refresh");

    res.json({
        accessToken,
        refreshToken,
    });
}
function verifyRefreshToken (token, callback) {
    if (refreshTokens.includes(token)) jwt.verify(token, REFRESH_SECRET, callback);
    else callback({ message: "incalid refreshToken", code: 403 });
}

module.exports = {
    verifyRefreshToken,
    verifyToken,
    returnPairTokens,
    revokeRefreshToken (token) {
        refreshTokens = refreshTokens.filter(_t => _t !== token)
    },
}