var mysql = require('mysql');
var config = require('../config.js');

let connection = mysql.createConnection({
	host: config.host,
	user: config.user,
	password: config.password
});

module.exports = connection;