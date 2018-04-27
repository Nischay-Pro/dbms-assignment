var connection = require('../../../middleware/mysql');
var config = require('../../../config');

connection.query('USE ' + config.database);

module.exports = function (app, passport) {

    app.get('/dashboard/donors', isLoggedIn, (req, res) => {
        connection.query(`SELECT * FROM blood_donors WHERE deleted=0`, (err, rows) => {
            if (err) {

            }
            res.render('dashboard/donors/index', {
                username: req.user.username,
                donors: rows
            });
        });
    });

    app.get('/dashboard/donors/create', isLoggedIn, (req, res) => {
        res.render('dashboard/donors/create', {
            username: req.user.username
        });
    });

    app.post('/dashboard/donors/create', isLoggedIn, (req, res) => {
        try {
            let elements = {}
            elements.full_name = connection.escape(req.body.firstName) + ' ' + connection.escape(req.body.lastName);
            elements.gender = connection.escape(req.body.gender);
            elements.birthday = connection.escape(req.body.birthday);
            elements.country = connection.escape(req.body.country);
            elements.state = connection.escape(req.body.state);
            elements.city = connection.escape(req.body.city);
            elements.pincode = connection.escape(req.body.pincode);
            elements.blood_group = connection.escape(req.body.bloodGroup);
            elements.phone = connection.escape(req.body.phone);
            elements.address = connection.escape(req.body.address1) + ' ' + connection.escape(req.body.address2);
            connection.query(`INSERT INTO blood_donors (full_name,gender,birthday,country,state,city,pincode,blood_group,phone,address) values (${elements.full_name},${elements.gender},${elements.birthday},${elements.country},${elements.state},${elements.city},${elements.pincode},${elements.blood_group},${elements.phone},${elements.address})`, (err, row) => {
                if (err) {
                    res.render('dashboard/donors/create', {
                        username: req.user.username,
                        message: err,
                        type: 'alert-danger'
                    });
                }
                res.render('dashboard/donors/create', {
                    username: req.user.username,
                    message: `Successfully Registered Donor with Donor ID #${row.insertId}`,
                    type: 'alert-success'
                });
            });
        } catch (ex) {
            res.render('dashboard/donors/create', {
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