'use strict';

var validation = require('../../lib/validation');

const SELECT_USER = 'SELECT userid, email, name, countersign, active, color, notification, registered_at, thumbnail FROM users WHERE userid = $1';
const UPDATE_PASSWORD = 'UPDATE auth SET password = $1 WHERE userid = $2 AND password = $3';
const UPDATE_THUMBNAIL = 'UPDATE users SET thumbnail = $1 WHERE userid = $2';

const addSQL = (sql, name, value) => {
  if (sql.parameters.length > 0) {
    sql.statement += ',';
  }
  sql.statement += ' ' + name + ' = $' + (sql.parameters.length + 1);
  sql.parameters.push(value);
};

const putConfig = (req, res) => {

  var conn = req.connection,
      userInfo = req.session.userInfo,
      name = req.body.name,
      email = req.body.email,
      countersign = req.body.countersign,
      color = req.body.color,
      notification = req.body.notification,
      sql = {};

  sql.statement = 'UPDATE users SET';
  sql.parameters = [];

  if (name) {
    if (name.length > 128) {
      console.error(req.receivedAt, 'PutConfig. illegal parameter name.');
      conn.done();
      return res.json({change: false});
    }
    addSQL(sql, 'name', name);
  }
  if (email) {
    if (!validation.isAllASCII(email) || email.length > 256) {
      console.error(req.receivedAt, 'PutConfig. illegal parameter email.');
      conn.done();
      return res.json({change: false});
    }
    addSQL(sql, 'email', email);
  }
  if (countersign) {
    if (!validation.isAllASCII(countersign) || countersign.length > 16) {
      console.error(req.receivedAt, 'PutConfig. illegal parameter countersign.');
      conn.done();
      return res.json({change: false});
    }
    addSQL(sql, 'countersign', countersign);
  }
  if (color) {
    if (!validation.isAllASCII(color) || color.length > 3) {
      console.error(req.receivedAt, 'PutConfig. illegal parameter color.');
      conn.done();
      return res.json({change: false});
    }
    addSQL(sql, 'color', color);
  }
  if (notification) {
    //TODO DBから値を取得する形にしておきたい でもDDLで制御されてはいる それを言うとそもそもnodeでバリデーションする意味って。。。
    if (notification !== 'NEVER'
     && notification !== 'UNLESS'
     && notification !== 'ALWAYS') {
      console.error(req.receivedAt, 'PutConfig. illegal parameter notification.');
      conn.done();
      return res.json({change: false});
    }
    addSQL(sql, 'notification', notification);
  }

  if (sql.parameters.length == 0) {
    conn.done();
    return res.json({change: false});
  }

  sql.statement += ' WHERE userid = $' + (sql.parameters.length + 1);
  sql.parameters.push(userInfo.userid);

  conn.client.query(sql.statement, sql.parameters, (err, result) => {
    if (err || result.rowCount !== 1) {
      console.error(req.receivedAt, 'PutConfig. sql UPDATE_CONFIGS error.', err);
      conn.done();
      return res.json({change: false});
    }
    conn.client.query(SELECT_USER, [userInfo.userid], (err, result) => {
      conn.done();
      if (err) {
        console.error(req.receivedAt, 'PutConfig. sql SELECT_USER error.', err);
        return res.json({change: false});
      }
      var userInfo = result.rows[0];
      if (!userInfo) {
        console.error(req.receivedAt, 'PutConfig. no user info.');
        return res.json({change: false});
      }
      req.session.userInfo = userInfo;
      console.log(req.receivedAt, 'PutConfig. success.');
      res.json({
        change: true,
        config: req.session.userInfo,
      });
    });
  });
};

const putPassword = (req, res) => {

  var conn = req.connection,
      userInfo = req.session.userInfo,
      nowPassword = req.body.now_password,
      newPassword = req.body.new_password;

  if (!newPassword || !validation.isAllASCII(newPassword) || newPassword.length > 16
   || !nowPassword || !validation.isAllASCII(nowPassword) || nowPassword.length > 16
   || nowPassword == newPassword) {
    console.error(req.receivedAt, 'PutPassword. illegal parameter password.');
    conn.done();
    return res.json({change: false});
  }
  conn.client.query(UPDATE_PASSWORD, [newPassword, userInfo.userid, nowPassword], (err, result) => {
    conn.done();
    if (err || result.rowCount !== 1) {
      console.error(req.receivedAt, 'PutPassword. sql UPDATE_PASSWORD error.', err);
      conn.done();
      return res.json({change: false});
    }
    res.json({change: true});
  });
};

const putThumbnail = (req, res, putFile) => {

  var conn = req.connection,
      userInfo = req.session.userInfo,
      filePath,// = req.files.thumbnail.path,
      filename;

  if (!filePath) {
    return res.json({change: false});
  }

  filename = 'thumb_' + userInfo.userid + '_' + Math.random().toString(36).slice(-8) + '.png';
  putFile(filename, filePath);

  conn.client.query(UPDATE_THUMBNAIL, [filename, userInfo.userid], (err, result) => {
    if (err || result.rowCount !== 1) {
      console.error(req.receivedAt, 'PutThumbnail. sql UPDATE_CONFIGS error.', err);
      conn.done();
      return res.json({change: false});
    }
    conn.client.query(SELECT_USER, [userInfo.userid], (err, result) => {
      conn.done();
      if (err) {
        console.error(req.receivedAt, 'PutThumbnail. sql SELECT_USER error.', err);
        return res.json({change: false});
      }
      var userInfo = result.rows[0];
      if (!userInfo) {
        console.error(req.receivedAt, 'PutThumbnail. no user info.');
        return res.json({change: false});
      }
      req.session.userInfo = userInfo;
      console.log(req.receivedAt, 'PutThumbnail. success.');
      res.json({
        change: true,
        config: req.session.userInfo,
      });
    });
  });
};

module.exports = (router, putFile) => {
  router.put('/config/password', putPassword);
  router.put('/config/thumbnail', (req, res) => putThumbnail(req, res, putFile));
  router.get('/config', (req, res) => res.json(req.session.userInfo));
  router.put('/config', putConfig);
  return router;
};

