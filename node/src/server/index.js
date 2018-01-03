'use strict';

const fs = require('fs');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const postgresql = require('pg');
const connect = require('connect');
const webpush = require('web-push');
const mailer = require('nodemailer');

const getPutFile = require('./lib/file');
const databaseConnecter = require('./lib/postgresql');
const getMailer = require('./lib/mail');
const websocket = require('./lib/websocket');
const phoneRouter = require('./lib/phone');
const certifyRouter = require('./route/certify');
const getRelationRouter = require('./route/relation');
const configRouter = require('./route/config');
const getWebpushRouter = require('./lib/webpush');

const API_VERSION = 1;

module.exports = (uploadFileDir, vapidKeyFile) => {

  process.on('uncaughtException', function(err) {
    console.log('Top level error. you can not recover.', err);
  });

  const app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(bodyParser({uploadDir: uploadFileDir}));
  app.use(cookieParser());

  app.use((req, res, next) => {

    var now = new Date(),
        nowStr = now.getFullYear()
         + "-" + (now.getMonth() + 1)
         + "-" + now.getDate()
         + " " + now.getHours()
         + ":" + now.getMinutes()
         + ":" + now.getSeconds()
         + "." + now.getMilliseconds();
    req.receivedAt = nowStr;

    var reqStr = 'method:' + req.method
               + ',path:' + req.path
               + ',query:' + JSON.stringify(req.query)
               + ',body:' + JSON.stringify(req.body);

    console.log(req.receivedAt, reqStr.replace(/\r?\n/g,''), 'receive request.');
    next();
  });

  app.use(express.static('public'));

  app.use('/api/v' + API_VERSION, (req, res, next) => {
    res.header('Content-Type', 'application/json; charset=utf-8');
    next();
  });

  // var sessionStore = new session.MemoryStore();
  // var sessionParser = session({
  //   store: sessionStore,
  //   secret: process.env.SESSION_SECRET,
  //   resave: false,
  //   saveUninitialized: false,
  //   cookie: {
  //     maxAge: 30 * 60 * 1000,
  //     httpOnly: false,
  //   },
  // });
  const sessionParser = session({
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    resave: false,
    cookie: {
      maxAge: 30 * 60 * 1000,
      httpOnly: true,
    },
  });
  app.use(sessionParser);

  var dbConnections = databaseConnecter(postgresql);
  app.use(dbConnections.expressConnect);

  app.use('/api/v' + API_VERSION, certifyRouter(express.Router(), getMailer(mailer)));

  app.use((req, res, next) => {
    if (!req.session.userInfo) {
      console.log(req.receivedAt, 'No session. No auth.');
      req.connection.done();
      return res.json({auth: false});
    }
    next();
  });

  const relationRouter = getRelationRouter();
  app.use('/api/v' + API_VERSION, relationRouter.routeRelation(express.Router()));

  app.use('/api/v' + API_VERSION, configRouter(express.Router(), getPutFile(fs)));

  const vapidKeys = require(vapidKeyFile);
  webpush.setVapidDetails(
    process.env.SENDER_EMAIL || 'mailto:motojouya@gmail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
  );
  const webpushRouters = getWebpushRouter(express.Router(), webpush, vapidKeys);
  app.use('/api/v' + API_VERSION, webpushRouters.router);

  app.use(function(req, res) {
    console.log(req.receivedAt, 'Resource does not exist.');
    req.connection.done();
    res.status(404);
    res.json({message: 'Not Found'});
  });

  app.use(function(err, req, res, next) {
    console.error(req.receivedAt, 'Fatal Error.', err);
    req.connection && req.connection.done();
    res.status(500);
    res.json({message: 'Server Error'});
  });

  const port = process.env.PORT || 3000;
  var server = app.listen(port, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Server start. http://%s:%s', host, port);
  });

  const wss = websocket(server, sessionParser, dbConnections.wsConnect, webpushRouters.sendWebpush);
  relationRouter.socketRelation(wss);
  phoneRouter(wss);
};

const SELECT_USER = 'SELECT userid, email, name, countersign, active, color, notification, registered_at, thumbnail FROM users WHERE userid = $1';

