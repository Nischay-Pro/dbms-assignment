var connection = require('../../middleware/mysql');
var config = require('../../config');

connection.query('USE ' + config.database);

module.exports = function (app, passport) {

	app.get('/dashboard', isLoggedIn, (req, res) => {
        connection.query(`SELECT quantity, SUM(quantity) FROM blood_donate`, (err, rows) => {
			if(err){

            }
            res.render('dashboard/index', {
                username: req.user.username,
                donate: (rows[0].quantity == null) ? 0 : rows[0].quantity
            });
		});
    });
    
    app.get('/dashboard/profile', isLoggedIn, (req, res) => {
		console.log(req.user);
		res.render('dashboard/profile', {
			username: req.user.username
		});
	});
};

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/');
};