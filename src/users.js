const db = require("./database");
const bcrypt = require("bcryptjs");

module.exports = {
    getUser: function (params, callback) {
        callback(null, params.id)

        // db.query("select * from users where id=?", params.id, (err, rows) => {
        //     if (err) callback(err);
        //     if (rows.length === 0) callback(new Error("incorrect user id"));
        //     else {
        //         const validPass = bcrypt.compareSync(params.password, rows[0].pass);

        //         if (validPass) callback(null, { id: params.id });
        //         else callback(new Error("incorrect password"));
        //     }
        // })
    },
    register: function (params, callback) {
        callback(null, params.id)

        // TODO: сделать проверку существования пользователя и валидность пароля и id
        // db.query("INSERT INTO users (id, pass) VALUES ?", [
        //     [params.id, bcrypt.hashSync(params.password, 10)]
        // ], (err) => {
        //     if (err) callback(err);
        //     else callback(null, { id: params.id, })
        // })

    },
}