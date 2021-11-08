const S3 = require('aws-sdk/clients/s3');
const fs = require('fs');

require('dotenv').config();

const s3 = new S3({
	region: process.env.AWS_BUCKET_REGION,
	credentials: {
		accessKeyId: process.env.AWS_BUCKET_ACCESS_KEY,
		secretAccessKey: process.env.AWS_BUCKET_SECRET_KEY,
	},
});

const uploadFile = (file) => {
	const fileStream = fs.createReadStream(file.path);

	const uploadParams = {
		Bucket: process.env.AWS_BUCKET_NAME,
		Body: fileStream,
		Key: file.filename,
	};

	return s3.upload(uploadParams).promise();
};

const getFileStream = (fileKey) => {
	const downloadParams = {
		Key: fileKey,
		Bucket: process.env.AWS_BUCKET_NAME,
	};

	return s3.getObject(downloadParams).createReadStream();
};

const deleteFile = (fileKey) => {
	const deleteParams = {
		Key: fileKey,
		Bucket: process.env.AWS_BUCKET_NAME,
	};

	return s3.deleteObject(deleteParams).promise();
};

module.exports = {
	uploadFile: uploadFile,
	getFileStream: getFileStream,
	deleteFile: deleteFile,
};
