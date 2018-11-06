const nodemailer = require('nodemailer');
const config = require('./config.js').emailConfig;

const transporter = nodemailer.createTransport(config.nodemailerAuthTransport);

const sendEmail = (req) => {
	const dataArray = Object.entries(req);

	let html = `<p>From: localhost</p>`;
	for (let i = 0; i < dataArray.length; i++) {
		html += `<p>${dataArray[i][0]}: ${JSON.stringify(dataArray[i][1])}</p>`
	};

	const subject = 'Test';

	const mailOptions = {
		from: config.senderAddress,
		to: config.listOfReceivers,
		subject,
		html
	};

	let isEmailSentSuccessfully;

	transporter.sendMail(mailOptions, (err, info) => {
		if (err) {
			console.log(err);
			isEmailSentSuccessfully = false;
		} else {
			isEmailSentSuccessfully = true;
		}
	});
};

module.exports.sendEmail = sendEmail;
