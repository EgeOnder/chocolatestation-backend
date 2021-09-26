const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

require('dotenv').config();

const contactRoute = require('../routes/contact');
const publicRoute = require('../routes/public');
const subscribeRoute = require('../routes/subscribe');

const app = express()
	.use(helmet())
	.use(morgan('common'))
	.use(express.json())
	.use(express.urlencoded({ extended: false }))
	.use(
		cors({
			origin: process.env.CLIENT,
			credentials: true,
		})
	)
	.use((req, res, next) => {
		const allowedOrigins = [process.env.CLIENT, process.env.CLIENT_WWW];
		const origin = req.headers.origin;

		if (allowedOrigins.includes(origin)) {
			res.set('Access-Control-Allow-Origin', origin);
		} else {
			res.set('Access-Control-Allow-Origin', process.env.CLIENT);
		}
		res.set('Access-Control-Allow-Credentials', true);
		res.set('X-Frame-Options', 'SAMEORIGIN');
		res.set(
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
app.use('/public', publicRoute);
app.use('/subscribe', apiLimiter, subscribeRoute);

const port = process.env.PORT || 8000;
app.listen(port, () => {
	console.log(`Listening at ${port}`);
});
