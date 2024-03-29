var connection = require('../../../middleware/mysql');
var config = require('../../../config');
var url = require('url');

connection.query('USE ' + config.database);

module.exports = function (app, passport) {

    app.get('/dashboard/donors', isLoggedIn, (req, res) => {
        connection.query(`SELECT * FROM blood_donors WHERE deleted=0`, (err, rows) => {
            if (err) {

            }
            res.render('dashboard/donors/index', {
                username: req.user.username,
                donors: rows,
                message: req.query.message,
                type: req.query.type
            });
        });
    });

    app.get('/dashboard/donors/create', isLoggedIn, (req, res) => {
        res.render('dashboard/donors/create', {
            username: req.user.username
        });
    });

    app.get('/dashboard/donors/view/:id', isLoggedIn, (req, res) => {
        try {
            connection.query(`SELECT * FROM blood_donors WHERE id=${connection.escape(req.params.id)}`, (err, row) => {
                if (err) {

                }
                if (row.length > 0) {
                    let data = JSON.parse(JSON.stringify(row[0]));
                    data.first_name = data.full_name.split('|')[0];
                    data.last_name = data.full_name.split('|')[1];
                    res.render('dashboard/donors/view', {
                        username: req.user.username,
                        donor: data,
                        message: req.query.message,
                        type: req.query.type
                    });
                }
            });
        } catch (ex) {

        }
    });

    app.get('/dashboard/donors/delete/:id', isLoggedIn, (req, res) => {
        try {
            connection.query(`UPDATE blood_donors SET deleted=1 WHERE id=${connection.escape(req.params.id)}`, (err, row) => {
                if (err) {
                    return res.redirect(url.format({
                        pathname: '/dashboard/donors',
                        query: {
                            username: req.user.username,
                            message: err,
                            type: 'alert-danger'
                        }
                    }));
                }
                res.redirect(url.format({
                    pathname: '/dashboard/donors',
                    query: {
                        username: req.user.username,
                        message: `Successfully Deleted Donor with Donor ID #${req.params.id}`,
                        type: 'alert-success'
                    }
                }));
            });

        } catch (ex) {
            return res.redirect(url.format({
                pathname: '/dashboard/donors',
                query: {
                    username: req.user.username,
                    message: err,
                    type: 'alert-danger'
                }
            }));
        }
    });

    app.post('/dashboard/donors/create', isLoggedIn, (req, res) => {
        try {
            let elements = {}
            elements.full_name = connection.escape(req.body.firstName + '|' + req.body.lastName);
            console.log(elements.full_name);
            elements.gender = connection.escape(req.body.gender);
            elements.birthday = connection.escape(req.body.birthday);
            elements.country = connection.escape(req.body.country);
            elements.state = connection.escape(req.body.state);
            elements.city = connection.escape(req.body.city);
            elements.pincode = connection.escape(req.body.pincode);
            elements.blood_group = connection.escape(req.body.bloodGroup);
            elements.phone = connection.escape(req.body.phone);
            elements.address = connection.escape(req.body.address1 + '!' + req.body.address2);
            connection.query(`INSERT INTO blood_donors (full_name,gender,birthday,country,state,city,pincode,blood_group,phone,address) values (${elements.full_name},${elements.gender},${elements.birthday},${elements.country},${elements.state},${elements.city},${elements.pincode},${elements.blood_group},${elements.phone},${elements.address})`, (err, row) => {
                if (err) {
                    return res.render('dashboard/donors/create', {
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

    app.post('/dashboard/donors/view/:id', isLoggedIn, (req, res) => {
        try {
            let elements = {}
            elements.full_name = connection.escape(req.body.firstName + '|' + req.body.lastName);
            console.log(elements.full_name);
            elements.id = connection.escape(req.body.donorID);
            elements.id2 = req.body.donorID;
            elements.gender = connection.escape(req.body.gender);
            elements.birthday = connection.escape(req.body.birthday);
            elements.country = connection.escape(req.body.country);
            elements.state = connection.escape(req.body.state);
            elements.city = connection.escape(req.body.city);
            elements.pincode = connection.escape(req.body.pincode);
            elements.blood_group = connection.escape(req.body.bloodGroup);
            elements.phone = connection.escape(req.body.phone);
            elements.address = connection.escape(req.body.address1 + '!' + req.body.address2);
            connection.query(`UPDATE blood_donors SET full_name = ${elements.full_name},gender=${elements.gender},birthday=${elements.birthday},country=${elements.country},state=${elements.state},city=${elements.city},pincode=${elements.pincode},blood_group=${elements.blood_group},phone=${elements.phone},address=${elements.address} WHERE id=${elements.id}`, (err, row) => {
                if (err) {
                    return res.redirect(url.format({
                        pathname: `/dashboard/donors/view/${elements.id2}`,
                        query: {
                            username: req.user.username,
                            message: err,
                            type: 'alert-danger'
                        }
                    }));
                }
                res.redirect(url.format({
                    pathname: `/dashboard/donors/view/${elements.id2}`,
                    query: {
                        username: req.user.username,
                        message: `Successfully Updated Donor #${elements.id}`,
                        type: 'alert-success'
                    }
                }));
            });
        } catch (ex) {
            res.redirect(url.format({
                pathname: `/dashboard/donors/view/${elements.id2}`,
                query: {
                    username: req.user.username,
                    message: err,
                    type: 'alert-danger'
                }
            }));
        }
    });
};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
};