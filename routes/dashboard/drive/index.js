var connection = require('../../../middleware/mysql');
var config = require('../../../config');
var url = require('url');

connection.query('USE ' + config.database);

module.exports = function (app, passport) {

    app.get('/dashboard/drive', isLoggedIn, (req, res) => {
        connection.query(`SELECT blood_drive.id, start, end, drive_name, location, name FROM blood_drive JOIN blood_client ON blood_drive.cid = blood_client.id WHERE blood_drive.deleted=0`, (err, rows) => {
            if (err) {

            }
            connection.query(`SELECT * FROM blood_client`, (err, rowsClient) => {
                if (err) {

                }
                res.render('dashboard/drive/index', {
                    username: req.user.username,
                    drives: rows,
                    clients: rowsClient,
                    message: req.query.message,
                    type: req.query.type
                });
            });
        });
    });

    app.get('/dashboard/drive/client', isLoggedIn, (req, res) => {
        res.render('dashboard/drive/client', {
            username: req.user.username
        });
    });

    app.get('/dashboard/drive/create', isLoggedIn, (req, res) => {
        connection.query(`SELECT * FROM blood_client`, (err, rowsClient) => {
            if (err) {

            }
            res.render('dashboard/drive/create', {
                username: req.user.username,
                clients: rowsClient
            });
        });
    });

    app.get('/dashboard/drive/view/:id', isLoggedIn, (req, res) => {
        try {
            connection.query(`SELECT * FROM blood_drive WHERE id=${connection.escape(req.params.id)}`, (err, row) => {
                if (err) {

                }
                if (row.length > 0) {
                    let data = JSON.parse(JSON.stringify(row[0]));
                    data.first_name = data.full_name.split('|')[0];
                    data.last_name = data.full_name.split('|')[1];
                    res.render('dashboard/drive/view', {
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

    app.get('/dashboard/drive/delete/:id', isLoggedIn, (req, res) => {
        try {
            connection.query(`UPDATE blood_drive SET deleted=1 WHERE id=${connection.escape(req.params.id)}`, (err, row) => {
                if (err) {
                    return res.redirect(url.format({
                        pathname: '/dashboard/drive',
                        query: {
                            username: req.user.username,
                            message: err,
                            type: 'alert-danger'
                        }
                    }));
                }
                res.redirect(url.format({
                    pathname: '/dashboard/drive',
                    query: {
                        username: req.user.username,
                        message: `Successfully Deleted Blood Drive with Blood Drive ID #${req.params.id}`,
                        type: 'alert-success'
                    }
                }));
            });

        } catch (ex) {
            return res.redirect(url.format({
                pathname: '/dashboard/drive',
                query: {
                    username: req.user.username,
                    message: err,
                    type: 'alert-danger'
                }
            }));
        }
    });

    app.post('/dashboard/drive/client', isLoggedIn, (req, res) => {
        try {
            let elements = {}
            elements.clientName = connection.escape(req.body.clientName);
            elements.clientPhone = connection.escape(req.body.clientPhone);
            elements.address = connection.escape(req.body.address1 + '!' + req.body.address2);
            connection.query(`INSERT INTO blood_client (name,address,phone_number) values (${elements.clientName},${elements.clientPhone},${elements.address})`, (err, row) => {
                if (err) {
                    return res.render('dashboard/drive/client', {
                        username: req.user.username,
                        message: err,
                        type: 'alert-danger'
                    });
                }
                res.render('dashboard/drive/client', {
                    username: req.user.username,
                    message: `Successfully Registered Client with Client ID #${row.insertId}`,
                    type: 'alert-success'
                });
            });
        } catch (ex) {
            res.render('dashboard/drive/client', {
                username: req.user.username,
                message: ex,
                type: 'alert-danger'
            });
        }

    });

    app.post('/dashboard/drive/view/:id', isLoggedIn, (req, res) => {
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
            connection.query(`UPDATE blood_drive SET full_name = ${elements.full_name},gender=${elements.gender},birthday=${elements.birthday},country=${elements.country},state=${elements.state},city=${elements.city},pincode=${elements.pincode},blood_group=${elements.blood_group},phone=${elements.phone},address=${elements.address} WHERE id=${elements.id}`, (err, row) => {
                if (err) {
                    return res.redirect(url.format({
                        pathname: `/dashboard/drive/view/${elements.id2}`,
                        query: {
                            username: req.user.username,
                            message: err,
                            type: 'alert-danger'
                        }
                    }));
                }
                res.redirect(url.format({
                    pathname: `/dashboard/drive/view/${elements.id2}`,
                    query: {
                        username: req.user.username,
                        message: `Successfully Updated Donor #${elements.id}`,
                        type: 'alert-success'
                    }
                }));
            });
        } catch (ex) {
            res.redirect(url.format({
                pathname: `/dashboard/drive/view/${elements.id2}`,
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