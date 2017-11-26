'use strict';

var ws = require('ws');
var parseCookie = require('connect').utils.parseCookie;

var SELECT_RELATION
  = 'SELECT users.userid AS userid'
  + '     , users.name AS name'
  + '     , users.color AS color'
  + '     , users.thumbnail AS thumbnail'
  + '     , self.is_applicant AS is_applicant'
  + '     , relations.status AS status'
  + '     , relations.relation_no AS relation_no'
  + '  FROM relation_user AS self'
  + ' INNER JOIN relations AS relations'
  + '    ON self.relation_no = relations.relation_no'
  + '   AND self.userid = $1'
  + '   AND relations.status IN (\'PENDING\', \'ACTIVE\')'
  + ' INNER JOIN relation_user AS other'
  + '    ON relations.relation_no = other.relation_no'
  + '   AND other.userid <> $2'
  + ' INNER JOIN users AS users'
  + '    ON other.userid = users.userid'
  + '   AND other.active = TRUE';

module.export = function (server, store, sendWebpush) {

  var inSession = function (cookie, store, callback) {
    store.get(parseCookie(cookie)['connect.sid'], callback);
  };

  var wss = new ws.Server({server: server}),
      connections = {},
      listeners = {};

  var sendMessage = function (userid, message, conn) {
    var userConn = connections[userid];
    if (userConn) {
      userConn.send(message);
    } else {
      sendWebpush(userid, conn, message, message.subject,
        (result) => {
          console.log('TODO');
        },
        (err) => {
          console.log('TODO');
        }
      );
    }
  };

  var onReceive = function (type, key, callback) {
    if (!listeners[type]) {
      listeners[type] = {};
    }
    listeners[type][key] = callback;
  };

  var cancelListener = function (type, key) {
    if (listeners[type]) {
      listeners[type][key] = null;
    }
  };

  wss.on('connection', function (ws) {
    var userInfo = getUserInfo();
    connections[userInfo.userid] = ws;
    ws.on('close', function () {
      connections[userInfo.userid] = null;
    });

    ws.on('message', function (message) {
      inSession(message.cookie, store, function(err, session) {

        if (err) {
          console.error('TODO', err);
          conn.done();
          return;
        }
        var userInfo = session.userInfo;
        var conn = session.connection;
        var selfUserid = userInfo.userid;
        var otherUserid = message.userid;

        conn.client.query(SELECT_RELATION + ' WHERE other.userid = $3', [selfUserid, selfUserid, otherUserid], function (err, result) {
          if (err) {
            console.error('TODO', err);
            conn.done();
            return;
          }
          var relation = result.rows[0]);
          if (!relation) {
            console.log('TODO');
            return;
          }

          var data,
              key,
              funcs;
          if (event && event.data) {
            contents = message.contents;
            funcs = listeners[message.type];
            for (key in funcs) {
              if (funcs.hasOwnProperty(key) && funcs[key].toString() === 'Function') {
                funcs[key](userInfo, relation, message.contents, conn);
              }
            }
          }
        });
      });
    });
  });

  return {
    sendMessage: sendMessage,
    onReceive: onReceive,
    cancelListener: cancelListener,
  };
};

