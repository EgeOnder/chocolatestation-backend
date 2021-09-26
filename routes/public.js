const { Router } = require('express');
const path = require('path');

const router = Router();

router.get('/:file', (req, res) => {
	res.sendFile(path.join(__dirname, '../', 'public', req.params.file));
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
