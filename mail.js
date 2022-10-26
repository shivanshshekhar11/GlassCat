const nodemailer = require('nodemailer');
const mailGun = require('nodemailer-mailgun-transport');

const auth = {
        auth: {
            api_key: '09e4e7343f482685cc892db242eb3b9c-d117dd33-83dc8dc8',
            domain: 'sandbox5a2ae5b83fbb4e7ba244f4f596897671.mailgun.org'
        }
};

const transporter = nodemailer.createTransport(mailGun(auth));

const sendMail = (name, email, subject, text, cb) => {
    const mailOptions = {
        sender: name,
        from: email,
        to: 'thejohndoe1024@gmail.com',
        subject: subject,
        text: text
    };

    transporter.sendMail(mailOptions, function(err, data) {
        if (err) {
            cb(err, null);
        } else {
            cb(null, data);
        }
    });
}

// Exporting the sendmail
module.exports = sendMail;