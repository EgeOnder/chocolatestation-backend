const { model, Schema } = require('mongoose');

const categorySchema = Schema({
	id: Number,
	slug: String,
	name: String,
	image: String,
	description: String,
	created_at: { type: Date, default: Date.now },
});

const Categories = model('Categories', categorySchema);

module.exports = { Categories: Categories };
