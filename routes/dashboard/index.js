module.exports = function (app, passport) {

	app.get('/dashboard', isLoggedIn, (req, res) => {
		console.log(req.user);
		res.render('dashboard/index', {
			username: req.user.username
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