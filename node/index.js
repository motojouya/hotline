'use strict';

const express = require('express');
const app = express();

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const postgresql = require('pg');
const connect = require('connect');
const webpush = require("web-push");
const mailer = require('nodemailer');
const fs = require('fs');
const getPutFile = require('./src/lib/file_mock');
const connectDatabase = require('./src/lib/postgresql');
const port = process.env.PORT || 3000;
const version = 1;
const certifyRouter = require('./src/server/certify');
const relationRouter = require('./src/server/relation');
const configRouter = require('./src/server/config');
const getWebpushRouter = require('./src/server/webpush');
const websocket = require('./src/server/websocket');
const phoneRouter = require('./src/server/phone');

const smtp = mailer.createTransport('SMTP', {
  service: process.env.MAIL_SERVICE,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
    port: process.env.MAIL_PORT,
  }
});

const SELECT_USER = 'SELECT userid, email, name, countersign, active, color, notification, registered_at, thumbnail FROM users WHERE userid = $1';
const sendMail = (mailto, subject, text) => {
  var message = {
    from: process.env.MAIL_FROM,
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

app.use(express.bodyParser({uploadDir: './tmp'}));

const vapidKeys = require("./application-server-keys.json");
webpush.setVapidDetails(
  process.env.SENDER_EMAIL, // || "mailto:motojouya@gmail.com",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});

app.use((req, res, next) => {
  //logger middleware
});
// app.use('/api/v' + version, (req, res, next) => {
//   res.header('Content-Type', 'application/json; charset=utf-8');
//   next();
// });

var sessionStore = new connect.session.MemoryStore();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(connectDatabase(postgresql));
app.use(cookieParser());

app.use(session({
  store: sessionStore,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 60 * 1000,
    httpOnly: false,
  },
}));

var {webpushRouter, sendWebpush} = getWebpushRouter(app.Router, webpush, vapidKeys);
var wss = websocket(server, store, sendWebpush);

//app.use(express.static(__dirname + 'public'));
app.use(express.static('public'));

app.use('/api/v' + version, certifyRouter(app.Router, sendMail));

app.use((req, res, next) => {
  if (!req.session.userInfo) {
    return res.send({});
  }
  next();
});

app.use('/api/v' + version, relationRouter(app.Router, wss));
app.use('/api/v' + version, configRouter(app.Router, getPutFile(fs)));
app.use('/api/v' + version, webpushRouter);

phoneRouter(wss);

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: err
  });
});

