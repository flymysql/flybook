const mysql = require('mysql')

exports.connection = mysql.createPool({
    host     : 'localhost',
    user     : '',
    password : '',
    database : '',
    multipleStatements: true
})