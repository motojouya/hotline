'use strict';

const nodemailer = require('nodemailer');

/*
const setting = {
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  ssl: true,
  use_authentication: true,
  user: process.env.MAIL_USER,
  pass: process.env.MAIL_PASS,
};
const mailer = nodemailer.createTransport('SMTP', setting);
*/

// const SELECT_USER = 'SELECT userid, email, name, countersign, active, color, notification, registered_at, thumbnail FROM users WHERE userid = $1';

const setting = {
  service: process.env.MAIL_SERVICE,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
    port: process.env.MAIL_PORT,
  }
};

const from = process.env.MAIL_FROM;

let mailer;

module.exports = (nodemailer) => {

  if (process.env.NODE_ENV === 'develop') {
    return (mailto, subject, text) => {
      console.log('Pretend to send mail.', mailto, subject, text);
    };
  }

  if (!mailer) {
    mailer = nodemailer.createTransport('SMTP', setting);
  }
  return (mailto, subject, text) => {
    var message = {
      from: from,
      to: mailto,
      subject: subject,
      text: text,
    };
    smtp.sendMail(message, function(err, res){
      if (err) {
        console.log(err);
      } else {
        console.log('Message sent: ' + res.message);
      }
      smtp.close();
    });
  };
};

