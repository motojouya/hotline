'use strict';

// const parseCookie = require('cookie').parse;
// const SELECT_RELATION
//     = 'SELECT users.userid AS userid'
//     + '     , users.name AS name'
//     + '     , users.color AS color'
//     + '     , users.thumbnail AS thumbnail'
//     + '     , self.is_applicant AS is_applicant'
//     + '     , relations.status AS status'
//     + '     , relations.relation_no AS relation_no'
//     + '  FROM relation_user AS self'
//     + ' INNER JOIN relations AS relations'
//     + '    ON self.relation_no = relations.relation_no'
//     + '   AND self.userid = $1'
//     + '   AND relations.status IN (\'PENDING\', \'ACTIVE\')'
//     + ' INNER JOIN relation_user AS other'
//     + '    ON relations.relation_no = other.relation_no'
//     + '   AND other.userid <> $2'
//     + ' INNER JOIN users AS users'
//     + '    ON other.userid = users.userid'
//     + '   AND other.active = TRUE';
const ws = require('ws');

module.exports = (server, sessionParser, dbConnect, sendWebpush) => {

  // var inSession = function (cookie, store, callback) {
  //   store.get(parseCookie(cookie)['connect.sid'], callback);
  // };

  var connections = {},
      listeners = {};
  const wsServer = new ws.Server({
    verifyClient: (info, done) => {
      sessionParser(info.req, {}, () => {
        console.log('Connecting websocket.', !!info.req.session.userInfo);
        done(!!info.req.session.userInfo);
      });
    },
    server: server,
    path: '/websocket',
  });

  const sendMessage = function (userid, contents, conn) {
    const userConn = connections[userid];
    if (userConn) {
      conn && conn.done();
      userConn.send(JSON.stringify(contents));

    } else {
      if (conn) {
        sendWebpush(userid, conn, contents, contents.subject,
          (result) => {
            console.log('Send Webpush success.', userid);
          },
          (err) => {
            console.error('Send Webpush error.', userid);
          }
        );
      }
    }
  };

  const onReceive = function (type, key, callback) {
    if (!listeners[type]) {
      listeners[type] = {};
    }
    listeners[type][key] = callback;
  };

  const cancelListener = function (type, key) {
    if (listeners[type]) {
      listeners[type][key] = null;
    }
  };

  wsServer.on('connection', function (ws, req) {

    const userInfo = req.session.userInfo;
    ws.userid = userInfo.userid;
    connections[userInfo.userid] = ws;

    ws.on('message', function (message) {
      console.log('received websocket message.', ws.userid, message);
      var msgObj = JSON.parse(message);

      dbConnect(function(err, conn) {
        if (err) {
          console.error('DB connection error.', err);
          return sendMessage(ws.userid, 'send message failure.', conn);
        }
        var selfUserid = ws.userid,
            key,
            funcs,
            calledAny = false;
        funcs = listeners[msgObj.type];
        for (key in funcs) {
          if (funcs.hasOwnProperty(key) && 'function' === typeof funcs[key]) {
            //TODO ï°êîÇÃä÷êîÇ…connÇìnÇµÇƒÇ¢ÇÈÇ™ÅAconnÇÕÇªÇÍÇºÇÍÇÃä÷êîÇ≈closeÇ≥ÇÍÇƒÇµÇ‹Ç§ÅB
            funcs[key](selfUserid, msgObj, conn);
            calledAny = true;
          }
        }
        if (!calledAny) {
          conn.done();
        }
      });
    });

    ws.on('error', function (err) {
      console.log('Websocket error at received message.', err);
      sendMessage(ws.userid, 'send message failure by unknown reason.', null);
    });

    ws.on('close', function () {
      connections[ws.userid] = null;
    });
  });

  return {
    sendMessage: sendMessage,
    onReceive: onReceive,
    cancelListener: cancelListener,
  };
};

