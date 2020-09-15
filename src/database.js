const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    port: 5502,
    user: 'root',
    password: 'adminadmin',
    database: 'demo'
});
// connection.connect();
// connection.end();

module.exports = connection;