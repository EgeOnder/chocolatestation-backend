const nodemailer = require('nodemailer');
const Handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

require('dotenv').config();

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.EMAIL,
		pass: process.env.EMAIL_PASS,
	},
});

const sendMail = (user, subject, type, data, token) => {
	const source = fs.readFileSync(
		path.join(__dirname, '..', '/templates/', `${type}.hbs`),
		'utf8'
	);
	const template = Handlebars.compile(source);

	const options = (email, locals) => {
		return {
			from: `istasyoncikolata.com <${process.env.EMAIL}>`,
			to: email,
			subject: subject,
			html: template(locals),
		};
	};

	if (type == 'contact')
		transporter.sendMail(
			options(user.email, {
				name: data.name,
				email: data.email,
				message: data.message,
			}),
			(error) => {
				if (error) return console.log(error);
			}
		);
	else if (type == 'subscribe') {
		const redirectAddress = `${process.env.CLIENT}/verify?code=${token}`;

		transporter.sendMail(
			options(user.email, {
				redirectAddress: redirectAddress,
				logo: `${process.env.API}/public/images/logo.png`,
				website: process.env.CLIENT,
				year: new Date().getFullYear(),
			}),
			(error) => {
				if (error) return console.log(error);
			}
		);
	}
};

module.exports = { sendMail: sendMail };
