'use strict';

import validation from '../lib/validation';

const SELECT_USER = 'SELECT userid, email, name, countersign, active, color, notification, registered_at, thumbnail FROM users WHERE userid = $1';
const UPDATE_PASSWORD = 'UPDATE auth SET password = $1 WHERE userid = $2 AND password = $3';

const getConfig = (req, res) => {
  //TODO DBアクセスしたほうが正確な情報にはなるが、いったんこれで
  return res.json(req.session.userInfo);
};

const addSQL = (sql, parameters, name, value) => {
  if (parameters.length > 0) {
    sql += ',';
  }
  sql += ' ' + name + ' = $' + (parameters.length + 1);
  parameters.push(value);
};

const putConfig = (req, res, putFile) => {

  var conn = req.connection,
      userInfo = req.session.userInfo,
      name = req.body.name,
      email = req.body.email,
      countersign = req.body.countersign,
      colorNumber = req.body.colorNumber,
      notification = req.body.notification,
      nowPassword = req.body.now_password,
      newPassword = req.body.new_password,
      filePath = req.files.thumbnail.path,
      sql = 'UPDATE auth SET',
      parameters = [],
      isFirst = true
      updatedUser = false,
      updatedAuth = false;

  if (filePath) {
    var ramdom = Math.random().toString(36).slice(-8);
    putFile('thumb_' + userInfo.userid + '_' + ramdom + '.png', filePath);
  }
  if (name) {
    if (name.length > 128) {
      conn.done();
      return console.log('TODO');
    }
    addSQL(sql, parameters, 'name', name);
  }
  if (email) {
    if (!validation.isASCII(email) || email.length > 256) {
      conn.done();
      return console.log('TODO');
    }
    addSQL(sql, parameters, 'email', email);
  }
  if (countersign) {
    if (!validation.isASCII(countersign) || countersign.length > 16) {
      conn.done();
      return console.log('TODO');
    }
    addSQL(sql, parameters, 'countersign', countersign);
  }
  if (colorNumber) {
    if (!validation.isASCII(colorNumber) || colorNumber.length > 3) {
      conn.done();
      return console.log('TODO');
    }
    addSQL(sql, parameters, 'colorNumber', colorNumber);
  }
  if (notification) { //TODO DBから値を取得する形にしておきたい
    if (notification !== 'NEVER'
     && notification !== 'UNLESS'
     && notification !== 'ALWAYS') {
      conn.done();
      return console.log('TODO');
    }
    addSQL(sql, parameters, 'notification', notification);
  }

  if (newPassword) {
    if (!validation.isASCII(newPassword) || newPassword.length > 16
     || !nowPassword || !validation.isASCII(nowPassword) || nowPassword.length > 16) {
      conn.done();
      return console.log('TODO');
    }
    conn.client.query(UPDATE_PASSWORD, [newPassword, userid, nowPassword], (err, result) => {
      if (updatedUser) {
        conn.done();
      }
      updatedAuth = true;
      if (err) {
        console.error('TODO', err);
      }
      var auth = result.rows[0];
      if (!auth) {
        console.error('TODO', err);
      }
      return res.json({password: true});
    });
  } else {
    updatedAuth = true;
  }

  if (parameters.length > 0) {
    sql += ' WHERE userid = $' + (parameters.length + 1);
    parameters.push(userInfo.userid);

    conn.client.query(sql, parameters, (err, result) => {
      if (updatedAuth) {
        conn.done();
      }
      updatedUser = true;
      if (err) {
        console.error('TODO', err);
      }
      req.session.userInfo = result.rows[0];
      return res.json(req.session.userInfo);
    });
  } else {
    updatedUser = true;
  }
};

export function (router, putFile) => {
  router.get(getConfig);
  router.put((req, res) => putConfig(req, res, putFile));
  return router;
};

