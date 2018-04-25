module.exports = function (app, passport) {
	app.get('/', function (req, res) {
		res.render('index'); 
	}); 

	app.get('/login', function (req, res) {
		res.render('login',  {
			message:req.flash('loginMessage')
		}); 
	}); 

	app.post('/login', passport.authenticate('local-login',  {
			successRedirect:'/dashboard/index', 
			failureRedirect:'/login', 
			failureFlash:true
		}), 
		function (req, res) {
			if (req.body.remember) {
				req.session.cookie.maxAge = 1000 * 60 * 3; 
			}else {
				req.session.cookie.expires = false; 
			}
			res.redirect('/'); 
		}); 

	app.get('/create', function (req, res) {
		res.render('create',  {
			message:req.flash('signupMessage')
		}); 
	}); 

	app.post('/create', passport.authenticate('local-signup',  {
		successRedirect:'/dashboard/index', 
		failureRedirect:'/create', 
		failureFlash:true
	})); 

	app.get('/logout', function (req, res) {
		req.logout(); 
		res.redirect('/'); 
	}); 

	app.get('/dashboard', isLoggedIn, (req, res) =>  {
		res.render('dashboard/index'); 
	});
}; 

function isLoggedIn(req, res, next) {

	if (req.isAuthenticated())
		return next(); 

	res.redirect('/'); 
}; 