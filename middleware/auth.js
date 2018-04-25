var passport = require('passport');
var connection = require('./mysql');
var config = require('../config');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');

connection.query('USE ' + config.database);

module.exports = function (passport) {
	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function (id, done) {
		connection.query(`SELECT * FROM ${config.usersTable} WHERE id = '${id}'`, function (err, rows) {
			done(err, rows[0]);
		});
	});

	passport.use(
		'local-signup',
		new LocalStrategy({
			usernameField: 'username',
			passwordField: 'password',
			passReqToCallback: true
			},
			function (req, username, password, done) {
				connection.query(`SELECT * FROM ${config.usersTable} WHERE username = '${username}'`, function (err, rows) {
					if (err)
						return done(err);
					if (rows.length) {
						// return done(null, false, req.flash('signupMessage', 'That username is already taken.')); 
					} else {
						var newUserMysql = {
							username: username,
							password: bcrypt.hashSync(password, null, null) // use the generateHash function in our user model
						};
						var insertQuery = `INSERT INTO ${config.usersTable} (username, password) values ('${username}', '${newUserMysql.password}')`;
						connection.query(insertQuery, function (err, rows) {
							newUserMysql.id = rows.insertId;
							return done(null, newUserMysql);
						});
					}
				});
			}));
	passport.use(
		'local-login',
		new LocalStrategy({
				usernameField: 'username',
				passwordField: 'password',
				passReqToCallback: true
			},
			function (req, username, password, done) { // callback with email and password from our form
				connection.query(`SELECT * FROM ${config.usersTable} WHERE username = '${username}'`, function (err, rows) {
					if (err)
						return done(err);
					if (!rows.length) {
						return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
					}

					// if the user is found but the password is wrong
					if (!bcrypt.compareSync(password, rows[0].password))
						return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

					// all is well, return successful user
					return done(null, rows[0]);
				});
			}));

	connection.on('error', function (err) {
		console.log(err.code);
	});
};