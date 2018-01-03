'use strict';

var validation = require('../../lib/validation');

const dafaultColor = 678;
const CHECK_AUTH = 'SELECT userid, password, onetime_password, registered, registered_at FROM auth WHERE userid = $1 AND password = $2';
const UPDATE_AUTH = 'UPDATE auth SET registered = TRUE WHERE userid = $1 AND password = $2';
const SELECT_USER = 'SELECT userid, email, name, countersign, active, color, notification, registered_at, thumbnail FROM users WHERE userid = $1';
const SELECT_USER_EMAIL = 'SELECT userid, email, name, countersign, active, color, notification, registered_at, thumbnail FROM users WHERE userid = $1 OR email = $2';
const INSERT_AUTH = 'INSERT INTO auth (userid, password, onetime_password) VALUES ($1, $2, $3)';
const INSERT_USER = 'INSERT INTO users (userid, email, name, countersign, active, color) VALUES ($1, $2, $3, $4, TRUE, $5)';

const login = (req, res) => {

  var conn = req.connection,
      userid = req.body.userid,
      password = req.body.password,
      onetimePassword = req.body.onetime_password;

  userid = userid && userid.trim();
  password = password && password.trim();
  onetimePassword = onetimePassword && onetimePassword.trim();

  conn.client.query(CHECK_AUTH, [userid, password], (err, result) => {
    if (err) {
      console.error(req.receivedAt, 'Login. sql CHECK_AUTH error.', err);
      conn.done();
      return res.json({login: false});
    }
    var auth = result.rows[0];
    if (!auth) {
      console.error(req.receivedAt, 'Login. no auth record.');
      conn.done();
      return res.json({login: false});
    }
    if (!auth.registered && onetimePassword !== auth.onetime_password) {
      console.log(req.receivedAt, 'Login. registeration is not completed or no onetime password.');
      conn.done();
      return res.json({login: false});
    }
    conn.client.query(UPDATE_AUTH, [userid, password], (err, result) => {
      if (err) {
        console.error(req.receivedAt, 'Login. sql UPDATE_AUTH error.', err);
        conn.done();
        return res.json({login: false});
      }
      conn.client.query(SELECT_USER, [userid], (err, result) => {
        conn.done();
        if (err) {
          console.error(req.receivedAt, 'Login. sql SELECT_USER error.', err);
          return res.json({login: false});
        }
        var userInfo = result.rows[0];
        if (!userInfo) {
          console.error(req.receivedAt, 'Login. no user info.');
          return res.json({login: false});
        }
        req.session.userInfo = userInfo;
        console.log(req.receivedAt, 'Login. success.');
        return res.json({login: true, config: userInfo});
      });
    });
  });
};

const check = (req, res) => {

  var conn = req.connection,
      userid = req.query.userid;

  userid = userid && userid.trim();

  conn.client.query(SELECT_USER, [userid], (err, result) => {
    conn.done();
    if (err) {
      console.error(req.receivedAt, 'Check. sql SELECT_USER error.', err);
      return res.json({exist: false});
    }
    console.log(req.receivedAt, 'Check. success.');
    if (result.rows[0]) {
      res.json({exist: true});
    } else {
      res.json({exist: false});
    }
  });
};

const register = (req, res, sendMail) => {

  var conn = req.connection,
      userid = req.body.userid,
      password = req.body.password,
      email = req.body.email,
      name = req.body.name,
      countersign = req.body.countersign;

  userid = userid && userid.trim(),
  password = password && password.trim(),
  email = email && email.trim(),
  name = name && name.trim(),
  countersign = countersign && countersign.trim();

  if (!userid || !validation.isAllASCII(userid)
   || !password || !validation.isAllASCII(password)
   || !email || !validation.isAllASCII(email)
   || !name
   || !countersign || !validation.isAllASCII(countersign)) {
    console.error(req.receivedAt, 'Register. illegal parameters.');
    conn.done();
    return res.json({register: false});
  }

  conn.client.query(SELECT_USER_EMAIL, [userid, email], (err, result) => {
    if (err) {
      console.error(req.receivedAt, 'Register. sql SELECT_USER_EMAIL error.', err);
      conn.done();
      return res.json({register: false});
    }
    var user = result.rows[0];
    if (user) {
      console.error(req.receivedAt, 'Register. no user.');
      conn.done();
      return res.json({register: false});
    }
    conn.client.query(INSERT_USER, [userid, email, name, countersign, dafaultColor], (err, result) => {
      if (err) {
        console.error(req.receivedAt, 'Register. sql INSERT_USER error.', err);
        conn.done();
        return res.json({register: false});
      }
      conn.client.query(INSERT_AUTH, [userid, password, validation.ramdomString(8)], (err, result) => {
        conn.done();
        if (err) {
          console.error(req.receivedAt, 'Register. sql INSERT_AUTH error.', err);
          return res.json({register: false});
        }
        console.log(req.receivedAt, 'Register. success.');
        sendMail(email, 'TODO', 'TODO'); //TODO
        return res.json({register: true});
      });
    });
  });
};

module.exports = (router, sendMail) => {
  router.get('/check', check);
  router.post('/register', (req, res) => register(req, res, sendMail));
  router.post('/login', login);
  return router;
};

