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
                    connection.query(`SELECT * FROM blood_client`, (err, rowsClient) => {
                        if (err) {

                        }
                        let data = JSON.parse(JSON.stringify(row[0]));
                        res.render('dashboard/drive/view', {
                            username: req.user.username,
                            message: req.query.message,
                            type: req.query.type,
                            clients: rowsClient
                        });
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

    app.post('/dashboard/drive/create', isLoggedIn, (req, res) => {
        try {
            let elements = {}
            elements.driveName = connection.escape(req.body.driveName);
            elements.location = connection.escape(req.body.location);
            elements.clientID = connection.escape(req.body.clientID);
            elements.startTime = connection.escape(req.body.startTime);
            elements.endTime = connection.escape(req.body.endTime);
            connection.query(`INSERT INTO blood_drive (drive_name,location,start,end,cid) values (${elements.driveName},${elements.location},${elements.startTime},${elements.endTime},${elements.clientID})`, (err, row) => {
                console.log(`INSERT INTO blood_drive (drive_name,location,start,end,cid) values (${elements.driveName},${elements.location},${elements.startTime},${elements.endTime},${elements.clientID})`);
                if (err) {
                    connection.query(`SELECT * FROM blood_client`, (err, rowsClient) => {
                        if (err) {

                        }
                        return res.render('dashboard/drive/create', {
                            username: req.user.username,
                            message: err,
                            type: 'alert-danger',
                            clients: rowsClient
                        });
                    });
                }
                connection.query(`SELECT * FROM blood_client`, (err, rowsClient) => {
                    if (err) {

                    }
                    return res.render('dashboard/drive/create', {
                        username: req.user.username,
                        message: `Successfully Registered Blood Drive with Drive ID #${row.insertId}`,
                        type: 'alert-success',
                        clients: rowsClient
                    });
                });
            });
        } catch (ex) {
            connection.query(`SELECT * FROM blood_client`, (err, rowsClient) => {
                if (err) {

                }
                return res.render('dashboard/drive/create', {
                    username: req.user.username,
                    message: err,
                    type: 'alert-danger',
                    clients: rowsClient
                });
            });
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
            elements.driveName = connection.escape(req.body.driveName);
            elements.location = connection.escape(req.body.location);
            elements.clientID = connection.escape(req.body.clientID);
            elements.startTime = connection.escape(req.body.startTime);
            elements.endTime = connection.escape(req.body.endTime);
            elements.id = connection.escape(req.params.id);
            elements.id2 = req.params.id;
            connection.query(`UPDATE blood_drive SET drive_name = ${elements.driveName},location=${elements.location},start=${elements.startTime},end=${elements.endTime},cid=${elements.id} WHERE id=${elements.id}`, (err, row) => {
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