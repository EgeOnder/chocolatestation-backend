const { Router } = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const router = Router();

require('dotenv').config();

const { User } = require('../models/User');

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
	const user = await User.findById(id);
	if (user) done(null, user);
});

passport.use(
	new LocalStrategy((username, password, done) => {
		User.findOne({ username: username }, (err, user) => {
			if (err) return done(err, null);
			if (!user) return done(null, false);

			bcrypt.compare(password, user.password, (error, success) => {
				if (error) return done(error, null);
				else if (success) return done(null, user);
				else return done(null, null);
			});
		});
	})
);

router.post('/register', async (req, res) => {
	const { username, password } = req.body;

	await bcrypt.hash(password, 16, (err, hashedPassword) => {
		if (err) return res.json({ error: err });

		const newUser = new User({
			username: username,
			password: hashedPassword,
		});

		newUser.save();
		return res.json({ success: true, message: 'New user created!' });
	});
});

router.post('/login', (req, res) => {
	passport.authenticate('local', (error, user) => {
		if (error) return res.json({ error: error });
		if (!user)
			return res.json({
				error: 'Girdiğiniz şifre veya kullanıcı ile kimseyi bulamadık!',
			});
		req.logIn(user, (err) => {
			if (err) return res.json({ error: error });
			return res.json({ success: true, message: 'Giriş başarılı!' });
		});
	})(req, res);
});

router.get('/user', (req, res) => {
	if (req.user) {
		const show = { username: req.user.username };
		res.json(show);
	} else res.json({ error: 'Not logged in!' });
});

module.exports = router;
