const User = require('../Models/user');
//to generate web token
const jwt = require('jsonwebtoken');
//to authorize authentication
const expressJwt = require('express-jwt');
const { errorHandler } = require('../Helpers/dbErrorHandler');

exports.signup = (req, res) => {
	//console.log('req.body', req.body);
	const user = new User(req.body);
	user.save((err, user) => {
		if (err)
			return res.status(400).json({
				err: errorHandler(err)
			});
		user.salt = undefined;
		user.hashed_password = undefined;
		res.json({
			user
		});
	});
};

exports.signin = (req, res) => {
	const { email, password } = req.body;
	User.findOne({ email }, (err, user) => {
		if (err || !user) {
			return res.status(400).json({
				error: 'User does not exist!'
			});
		}
		//Authenticate method in user model
		if (!user.authenticate(password)) {
			return res.status(401).json({
				error: 'Email and password do not match'
			});
		}
		//Token generation with secret
		const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
		res.cookie('t', token, { expire: new Date() + 9999 });
		//return response with user and token to front end client
		const { _id, name, email, role } = user;
		return res.json({ token, user: { _id, name, email, role } });
	});
};
exports.signout = (req, res) => {
	res.clearCookie('t');
	res.json({
		message: 'User has signed out successfully!'
	});
};

exports.requireSignin = expressJwt({
	secret: process.env.JWT_SECRET,
	algorithms: [ 'HS256' ], // added later
	userProperty: 'auth'
});

exports.isAuth = (req, res, next) => {
	let user = req.profile && req.auth && req.profile._id == req.auth._id;
	if (!user) {
		return res.status(403).json({
			error: 'Access denied'
		});
	}
	next();
};

exports.isAdmin = (req, res, next) => {
	if (req.profile.role === 0) {
		return res.status(403).json({
			error: 'Admin restriction! User not allowed.'
		});
	}
	next();
};
