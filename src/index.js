const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const passport = require('passport');
const session = require('express-session');

require('dotenv').config();

const contactRoute = require('../routes/contact');
const publicRoute = require('../routes/public');
const apiRoute = require('../routes/api');
const authRoute = require('../routes/auth');

const { connectToDb } = require('../functions/connectToDb');
connectToDb(process.env.MONGODB_CONNECTION);

const allowedOrigins = [
	process.env.CLIENT,
	process.env.CLIENT_WWW,
	process.env.ADMIN,
	process.env.ADMIN_WWW,
];

const app = express()
	.use(helmet())
	.use(morgan('common'))
	.use(express.json({ limit: '50mb' }))
	.use(
		express.urlencoded({
			extended: false,
			limit: '50mb',
			parameterLimit: 1000000,
		})
	)
	.use(
		cors({
			origin: allowedOrigins,
			credentials: true,
		})
	)
	.use(
		session({
			name: 'auth',
			resave: true,
			saveUninitialized: true,
			secret: process.env.LOCAL_SECRET,
			cookie: {
				domain: process.env.DOMAIN,
			},
		})
	)
	.use(passport.initialize())
	.use(passport.session())
	.use((req, res, next) => {
		const origin = req.headers.origin;

		res.setHeader(
			'Access-Control-Allow-Origin',
			allowedOrigins.includes(origin) ? origin : process.env.CLIENT
		);
		res.setHeader('Access-Control-Allow-Credentials', true);
		res.setHeader('X-Frame-Options', 'SAMEORIGIN');
		res.setHeader(
			'Access-Control-Allow-Headers',
			'Origin, X-Requested-With, Content-Type, Accept'
		);
		next();
	});

const apiLimiter = rateLimit({
	windowMs: 5 * 60 * 1000,
	max: 10,
});

app.use('/contact', apiLimiter, contactRoute);
app.use('/api', apiRoute);
app.use('/public', publicRoute);
app.use('/auth', authRoute);

const port = process.env.PORT || 8000;
app.listen(port, () => {
	console.log(`Listening at ${port}`);
});
