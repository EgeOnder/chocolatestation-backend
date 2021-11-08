const { model, Schema } = require('mongoose');

const prodSchema = Schema({
	id: Number,
	name: String,
	description: String,
	image: String,
	price: Number,
	category: String,
	created_at: { type: Date, default: Date.now },
});

const Product = model('Product', prodSchema);

module.exports = { Product: Product };
