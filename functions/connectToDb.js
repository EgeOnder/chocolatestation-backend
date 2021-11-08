const { connect } = require('mongoose');

const db = (connectionString) => {
	connect(connectionString)
		.then(() => console.log('MongoDB connection established'))
		.catch((err) => console.log(err));
};

module.exports = { connectToDb: db };
