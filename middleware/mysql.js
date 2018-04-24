var mysql = require('mysql'); 
var config = require('../config'); 

let connection = mysql.createConnection(config.connection); 

module.exports = connection; 