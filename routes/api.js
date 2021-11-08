const { Router } = require('express');
const multer = require('multer');
const fs = require('fs');
const util = require('util');

const unlinkFile = util.promisify(fs.unlink);
const upload = multer({ dest: 'uploads/' });

require('dotenv').config();

const router = Router();

const { uploadFile, deleteFile } = require('../src/s3');

const { Categories } = require('../models/Categories');
const { Product } = require('../models/Product');

const slugify = (text) => {
	return String(text)
		.toLowerCase()
		.replaceAll('ç', 'c')
		.replaceAll('ü', 'u')
		.replaceAll('ı', 'i')
		.replaceAll('ö', 'o')
		.replaceAll('ş', 's')
		.replaceAll('ğ', 'g')
		.replace(/[^\w ]+/g, '')
		.replace(/ +/g, '-');
};

router.get('/categories', async (req, res) => {
	const categories = await Categories.find({});

	res.json(categories);
});

router.post('/categories', upload.single('image'), async (req, res) => {
	const { name, description } = req.body;
	const file = req.file;

	const category = await Categories.findOne({ name: name });

	if (category) return res.json({ error: 'Kategori zaten mevcut.' });
	if (!name) return res.json({ error: 'Kategoriye bir isim girmelisiniz.' });
	if (!file)
		return res.json({ error: 'Kategoriye bir resim eklemelisiniz.' });

	// validation passed
	const result = await uploadFile(file);
	await unlinkFile(file.path);

	const newCategory = await Categories.create({
		id: new Date().valueOf(),
		name: name,
		slug: slugify(name),
		description: description,
		image: result.Key,
	});

	await newCategory.save();
	return res.json({ success: true, message: 'Yeni kategori oluşturuldu.' });
});

router.delete('/categories/:id', async (req, res) => {
	const { id } = req.params;

	try {
		await deleteFile(id);

		await Categories.deleteOne({ image: id });
		return res.json({ success: true, message: 'Kategori kaldırıldı.' });
	} catch (error) {
		console.log(error);
		return res.json({ error: error.message });
	}
});

router.get('/product', async (req, res) => {
	const products = await Product.find({});

	res.json(products);
});

router.post('/product', upload.single('image'), async (req, res) => {
	const { name, description, price, category } = req.body;
	const file = req.file;

	const product = await Product.findOne({ name: name });

	if (product) return res.json({ error: 'Bu ürün zaten mevcut.' });
	if (!name) return res.json({ error: 'Ürüne isim vermelisiniz.' });
	if (!file) return res.json({ error: 'Ürüne resim vermelisiniz.' });
	if (!price) return res.json({ error: 'Ürüne fiyat vermelisiniz.' });

	// validation passed
	const result = await uploadFile(file);
	await unlinkFile(file.path);

	const newProduct = await Product.create({
		id: new Date().valueOf(),
		name: name,
		description: description,
		image: result.Key,
		price: price,
		category: category,
	});

	await newProduct.save();
	return res.json({ success: true, message: 'Yeni ürün oluşturuldu.' });
});

router.get('/product/:category', async (req, res) => {
	const { category } = req.params;

	const products = await Product.find({ category: category });
	return res.json(products);
});

router.delete('/product/:id', async (req, res) => {
	const { id } = req.params;

	try {
		await deleteFile(id);

		await Product.deleteOne({ image: id });
		return res.json({ success: true, message: 'Ürün kaldırıldı.' });
	} catch (error) {
		console.log(error);
		return res.json({ error: error.message });
	}
});

module.exports = router;
