const { model, Schema } = require('mongoose');

const userSchema = Schema({
	username: String,
	password: String,
	created_at: { type: Date, default: Date.now },
});

const User = model('User', userSchema);

module.exports = { User: User };
