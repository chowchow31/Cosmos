var nodemailer = require('nodemailer'),		// e-mail sending module for Node.js
	settings = require('../settings.js');

module.exports = function (e) {
    // create reusable transporter object using the default SMTP transport
    //var mailTransporter = nodemailer.createTransport('smtps://user%40mail:pass@smtp');
	var mailTransporter = nodemailer.createTransport('smtps://' + settings.nodemailer.user + '%40' +
         settings.nodemailer.mail + ':' + settings.nodemailer.pass + '@' + settings.nodemailer.smtp), 
		from = 'COSMOS <' + settings.app.support + '>',
		errorRecipient = settings.app.errorRecipient;

	return {
		//send email 
		send: function (to, subject, body) {
			mailTransporter.sendMail({
				from: from,
				to: to,
				subject: subject,
				html: body,
				generateTextFormHtml: true
			}, function (err) {
				if (err) console.error('Unable to send email: ' + err);
			});
		},
		
		//send mail error
		emailError: function (message, filename, exception) {
			var body = '<h2>Happtial Site Error</h2>' + 'message:<br><pre>' + message + '</pre><br>';
			if (exception) body += 'exception:<br><pre>' + exception + '</pre><br>';
			if (filename) body += 'filename:<br><pre>' + filename + '</pre><br>';

			mailTransporter.sendMail({
				from: from,
				to: errorRecipient,
				subject: 'Happtial Site Error',
				html: body,
				generateTextFormHtml: true
			}, function (err) {
				if (err) {
					console.error('Unable to send email: ' + err);
					logger.error('emailError error:' + err);
				}
			});
		},
	};
};
