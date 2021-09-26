const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

const { sendMail } = require('../functions/sendMail');
const { Subscribe } = require('../models/Subscribe');

require('dotenv').config();

function checkEmail(email) {
	const regEx =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return regEx.test(String(email).toLowerCase());
}

router.post('/', async (req, res) => {
	const { email } = req.body;

	if (!email) return res.json({ error: 'Lütfen e-postanızı giriniz.' });
	if (!checkEmail(email))
		return res.json({
			error: 'Lütfen geçerli bir e-posta adresi giriniz.',
		});
	const emailExists = await Subscribe.findOne({
		email: String(email).toLowerCase(),
	});
	if (emailExists) {
		if (emailExists.verified)
			return res.json({ error: 'Bültene zaten kayıtlısınız!' });
		else {
			const accessToken = jwt.sign(
				{ email: email },
				process.env.JWT_SECRET
			);

			try {
				const updated = await Subscribe.findOneAndUpdate(
					{ email: email },
					{ access_token: accessToken }
				);

				await updated.save();

				await sendMail(
					{ email: email },
					'Bültene Kaydol | Chocolate Station',
					'subscribe',
					{},
					accessToken
				);
				return res.json({
					success: true,
					message:
						'Bültene kaydolmak için e-postanızdaki bağlantıya tıklayıp onaylamalısınız!',
				});
			} catch (error) {
				return res.json({ error: error });
			}
		}
	}

	// passed validation
	try {
		const accessToken = jwt.sign({ email: email }, process.env.JWT_SECRET);

		const newSubscription = await Subscribe.create({
			email: String(email).toLowerCase(),
			access_token: accessToken,
		});

		await newSubscription.save();

		await sendMail(
			{ email: email },
			'Bültene Kaydol | Chocolate Station',
			'subscribe',
			{},
			accessToken
		);

		return res.json({
			success: true,
			message: 'Bültene kaydolmak için e-postanızı kontrol ediniz.',
		});
	} catch (error) {
		return res.json({ error: error });
	}
});

router.post('/verify', async (req, res) => {
	const { code } = req.query;

	const sub = await Subscribe.findOne({ access_token: code });

	if (!sub) return res.json({ error: 'Kayıt bulunamadı!' });

	try {
		const updated = await Subscribe.findOneAndUpdate(
			{
				access_token: code,
			},
			{ verified: true, $unset: { access_token: code } }
		);

		await updated.save();

		return res.json({
			success: true,
			message: 'Bültene başarıyla kaydoldunuz!',
		});
	} catch (error) {
		return res.json({ error: error });
	}
});

module.exports = router;
