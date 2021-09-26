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
	const { email, name, message } = req.body;

	if (!email) return res.json({ error: 'Lütfen e-postanızı giriniz.' });
	if (!name || name.length < 2)
		return res.json({ error: 'Lütfen isminizi giriniz.' });
	if (!message || message.length < 2)
		return res.json({ error: 'Lütfen mesajınızı giriniz.' });
	if (!checkEmail(email))
		return res.json({
			error: 'Lütfen geçerli bir e-posta adresi giriniz.',
		});

	// passed validation
	const data = {
		email: email,
		name: name,
		message: message,
	};

	try {
		sendMail(
			{ email: process.env.TO_EMAIL },
			'Chocolate Station | İletişim Formu',
			'contact',
			data
		);
		return res.json({ success: true, message: 'Mesajınız iletilmiştir.' });
	} catch (error) {
		return res.json({ error: error });
	}
});

module.exports = router;
