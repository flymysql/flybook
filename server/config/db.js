const mysql = require('mysql')
const db = require('../../config.js').db;

exports.connection = mysql.createPool(db);