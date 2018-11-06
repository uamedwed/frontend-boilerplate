const mongodb = require('mongodb');
const express = require('express');
const config = require('./config.js');
const sendEmail = require('./sendEmail.js').sendEmail;
const router = express.Router();

const app = express();
const uri = config.uri;
const port = config.port;
const baseAddress = config.baseAddress;

// allow Cross-domain requests
// router.use(require('cors')())

// automatically parses request data to JSON
router.use(require('body-parser').json());

router.use(express.static('dist'));

mongodb.MongoClient.connect(uri, (err, db) => {
	const collection = db.collection('inbox')

	router.get('/api/v1/inbox/api_key=' + config.apiKey, (req, res) => {
		collection.find({  }).toArray((err, docs) => {
			if (err) {
				res.send('An error occured')
			} else {
				res.send(docs)
			}
		})
	});

	router.post('/api/v1/inbox/', (req, res) => {
		const receivedData = { ...req.body };

		const url = (req.protocol + '://' + req.get('host') + req.originalUrl)
			.replace('api/v1/inbox', '');

		let ref = req.headers.referer;

		// send email
        sendEmail(receivedData, url);

		// insert data to database
		collection.insertOne(receivedData, (err, r) => {
			if (err) {
				res.send('An error occured')
			} else {
				res.send('OK')
			}
		})
	});

	app.use(baseAddress, router);

	const listener = app.listen(port, () => {
		console.log(
			'Server listening on port ' + port + '. Base address is ' + baseAddress
		);
	});
});
