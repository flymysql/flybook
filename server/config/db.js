const mysql = require('mysql')

exports.connection = mysql.createPool({
    host     : '120.77.183.14',
    user     : 'www_idealli_com',
    password : 'test',
    database : 'www_idealli_com',
    multipleStatements: true
})