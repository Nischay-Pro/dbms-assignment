var connection = require('../../../middleware/mysql');
var config = require('../../../config');
var url = require('url');

connection.query('USE ' + config.database);

module.exports = function (app, passport) {

	app.get('/dashboard/donate', isLoggedIn, (req, res) => {
		connection.query(`SELECT bd.full_name,bdr.drive_name,bdo.quantity, bdo.id FROM blood_donors bd,blood_drive bdr,blood_donate bdo WHERE bdo.did=bd.id AND bdo.drid=bdr.id`, (err, rows) => {
			if (err) {

			}
			res.render('dashboard/donate/index', {
				username: req.user.username,
				donates: rows
			});
		});
	});

	app.get('/dashboard/donate/create', isLoggedIn, (req, res) => {
		connection.query(`SELECT * FROM blood_drive`, (err, rowsDrives) => {
			if (err) {

			}
			connection.query(`SELECT * FROM blood_donors`, (err, rowsDonors) => {
				if (err) {

				}
				res.render('dashboard/donate/create', {
					username: req.user.username,
					donors: rowsDonors,
					drives: rowsDrives
				});
			});
		});
	});

	app.post('/dashboard/donate/create', isLoggedIn, (req, res) => {
		try {
			let elements = {}
			elements.quantity = connection.escape(req.body.quantity);
			elements.donorID = connection.escape(req.body.donorID);
			elements.driveID = connection.escape(req.body.driveID);
			connection.query(`INSERT INTO blood_donate (did,drid,quantity) values (${elements.donorID},${elements.driveID},${elements.quantity})`, (err, row) => {
				if (err) {
					return res.render('dashboard/donate/create', {
						username: req.user.username,
						message: err,
						type: 'alert-danger'
					});
				}
				connection.query(`SELECT * FROM blood_drive`, (err, rowsDrives) => {
					if (err) {
		
					}
					connection.query(`SELECT * FROM blood_donors`, (err, rowsDonors) => {
						if (err) {
		
						}
						res.render('dashboard/donate/create', {
							username: req.user.username,
							donors: rowsDonors,
							drives: rowsDrives,
							message: `Successfully Donated`,
							type: 'alert-success'
						});
					});
				});
			});
		} catch (ex) {
			res.render('dashboard/donate/create', {
				username: req.user.username,
				message: ex,
				type: 'alert-danger'
			});
		}

	});

};

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/');
};