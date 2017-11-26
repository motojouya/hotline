'use strict';

import validation from '../lib/validation';

const dafaultColor = 678;
const CHECK_AUTH = 'SELECT userid, password, onetime_password, registered_at FROM auth WHERE userid = $1 AND password = $2';
const UPDATE_AUTH = 'UPDATE auth SET registerd = TRUE WHERE userid = $1 AND password = $2';
const SELECT_USER = 'SELECT userid, email, name, countersign, active, color, notification, registered_at, thumbnail FROM users WHERE userid = $1';
const SELECT_USER_EMAIL = 'SELECT userid, email, name, countersign, active, color, notification, registered_at, thumbnail FROM users WHERE email = $1';
const INSERT_AUTH = 'INSERT INTO auth (userid, password, onetime_password) VALUES ($1, $2, $3)';
const INSERT_USER = 'INSERT INTO auth (userid, email, name, countersign, active, color) VALUES ($1, $2, $3, $4, TRUE, $5)';

const login = (req, res) => {

  var conn = req.connection,
      userid = req.body.userid.trim(),
      password = req.body.password.trim(),
      onetimePassword = req.body.onetime_password.trim(),

  conn.client.query(CHECK_AUTH, [userid, password], (err, result) => {
    if (err) {
      console.error('TODO', err);
    }
    var auth = result.rows[0];
    if (!auth) {
      conn.done();
      return res.json({login: false});
    }
    if (!auth.registerd) {
      if (!onetimePassword === auth.onetime_password) {
        conn.done();
        return res.json({login: false});
      }
    }
    conn.client.query(UPDATE_AUTH, [userid, password], (err, result) => {
      if (err) {
        conn.done();
        console.error('TODO', err);
      }
      conn.client.query(SELECT_USER, [userid], (err, result) => {
        conn.done();
        if (err) {
          console.error('TODO', err);
        }
        var userInfo = result.rows[0];
        if (!userInfo) {
          console.log('TODO');
        }
        req.session.userInfo = userInfo;
        res.json(userInfo);
      });
    });
  });
};

const check = (req, res) => {
  
  var conn = req.connection,
      userid = req.params.userid.trim();

  conn.client.query(SELECT_USER, [userid], (err, result) => {
    conn.done();
    if (err) {
      console.error('TODO', err);
    }
    if (result.rows[0]) {
      res.json({canuse: false});
    } else {
      res.json({canuse: true}));
    }
  });
};

const register = (req, res, sendMail) => {

  var conn = req.connection,
      userid = req.body.userid.trim(),
      password = req.body.password.trim(),
      passwordAgain = req.body.password_again.trim(),
      onetimePassword = req.body.onetime_password.trim(),
      email = req.body.email.trim(),
      name = req.body.name.trim(),
      countersign = req.body.countersign.trim();

  if (!userid || !validation.isAllASCII(userid)
   || !password || !validation.isAllASCII(password)
   || !passwordAgain || !validation.isAllASCII(passwordAgain)
   || !onetimePassword || !validation.isAllASCII(onetimePassword)
   || !email || !validation.isAllASCII(email)
   || !name || !validation.isAllASCII(name)
   || !countersign || !validation.isAllASCII(countersign)) {
    //TODO
  }
  if (password !== password_again) {
    //TODO
  }

  conn.client.query(SELECT_USER_EMAIL, [email], (err, result) => {
    if (err) {
      conn.done();
      return console.error('TODO', err);
    }
    var user = result.rows[0];
    if (user) {
      conn.done();
      return res.json({register: false});
    }
    conn.client.query(INSERT_AUTH, [userid, password, onetimePassword], (err, result) => {
      if (err) {
        console.error('TODO', err);
      }
      conn.client.query(INSERT_USER, [userid, email, name, countersign, dafaultColor], (err, result) => {
        if (err) {
          conn.done();
          console.error('TODO', err);
        }
        sendMail(email, 'TODO', 'TODO');
        return res.json({register: false});
      });
    });
  });
};

export function (router, sendMail) => {
  router.get('/checkuser', check);
  router.post('/register', (req, res) => register(req, res, sendMail));
  router.post('/login', login);
  return router;
};

