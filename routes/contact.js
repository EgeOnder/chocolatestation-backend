const express = require('express');

const router = express.Router();

const { sendMail } = require('../functions/sendMail');

require('dotenv').config();

function checkEmail(email) {
	const regEx =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return regEx.test(String(email).toLowerCase());
}

router.post('/', (req, res) => {
	const { email, name, lastName, message } = req.body;

	const loweredEmail = String(email).toLowerCase();

	if (!loweredEmail)
		return res.json({ error: 'Lütfen e-postanızı giriniz.' });
	if (!name || name.length < 2)
		return res.json({ error: 'Lütfen isminizi giriniz.' });
	if (!lastName) return res.json({ error: 'Lütfen soy isminizi giriniz.' });
	if (!message || message.length < 2)
		return res.json({ error: 'Lütfen mesajınızı giriniz.' });
	if (!checkEmail(loweredEmail))
		return res.json({
			error: 'Lütfen geçerli bir e-posta adresi giriniz.',
		});

	const fullName = name + ' ' + lastName;

	// passed validation
	const data = {
		email: loweredEmail,
		name: fullName,
		message: message,
	};

	try {
		sendMail(
			{ email: process.env.TO_EMAIL },
			'İletişim Formu — Chocolate Station',
			'contact',
			data
		);
		return res.json({ success: true, message: 'Mesajınız iletilmiştir.' });
	} catch (error) {
		return res.json({ error: error });
	}
});

module.exports = router;
