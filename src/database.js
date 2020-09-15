const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    port: 5502,
    user: 'root',
    password: 'adminadmin',
    database: 'demo'
});
// connection.connect();


module.exports = function () {
    if(connection.state !== "connected") return;
    connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
        if (error) throw error;
        console.log('The solution is: ', results[0].solution);
    });
    connection.end();
}