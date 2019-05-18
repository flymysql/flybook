const mysql = require('mysql')

exports.connection = mysql.createPool({
    host     : '',
    user     : '',
    password : '',
    database : '',
    multipleStatements: true
})