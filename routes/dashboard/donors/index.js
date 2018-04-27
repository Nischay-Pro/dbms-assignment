var connection = require('../../../middleware/mysql');
var config = require('../../../config');

connection.query('USE ' + config.database);

module.exports = function (app, passport) {

    app.get('/dashboard/donors', isLoggedIn, (req, res) => {
        connection.query(`SELECT * FROM blood_donors WHERE deleted=0`, (err, rows) => {
            if(err){
                
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
        res.render('dashboard/donors/create', {
            username: req.user.username
        });
    });
};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
};