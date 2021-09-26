const { Schema, model } = require('mongoose');

const subSchema = Schema({
	email: String,
	access_token: String,
	verified: { type: Boolean, default: false },
	created_at: { type: Date, default: Date.now },
});

const Subscribe = model('Subscribe', subSchema);

module.exports = { Subscribe: Subscribe };
