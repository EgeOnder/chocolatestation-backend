const { Router } = require('express');
const path = require('path');

const router = Router();

const { getFileStream } = require('../src/s3');

router.get('/:file', (req, res) => {
	res.sendFile(path.join(__dirname, '../', 'public', req.params.file));
});

router.get('/s3/:img', async (req, res) => {
	const { img } = req.params;
	const fileStream = await getFileStream(img);

	fileStream.pipe(res);
});

router.get('/images/:file', (req, res) => {
	res.sendFile(
		path.join(__dirname, '../', 'public', 'images', req.params.file)
	);
});

router.get('/images/menu/:file', (req, res) => {
	res.sendFile(
		path.join(__dirname, '../', 'public', 'images', 'menu', req.params.file)
	);
});

router.get('/logo/:file', (req, res) => {
	res.sendFile(
		path.join(__dirname, '../', 'public', 'logo', req.params.file)
	);
});

router.get('/favicon/:file', (req, res) => {
	res.sendFile(
		path.join(__dirname, '../', 'public', 'favicon', req.params.file)
	);
});

module.exports = router;
