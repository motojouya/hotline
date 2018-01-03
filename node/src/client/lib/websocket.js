
export default function (whenErr) {

  var wsConn,
      listeners = {};

  var sendMessage = function (type, userid, contents) {

    var msgObj,
        msgStr;
    if (!contents) {
      msgObj = {
        type: type,
        contents: userid,
      };
    } else {
      msgObj = {
        type: type,
        userid: userid,
        contents: contents,
      };
    }
    msgStr = JSON.stringify(msgObj);
    if (wsConn) {
      wsConn.send(msgStr);
    } else {
      connect(function () {
        wsConn.send(msgStr);
      });
    }
  };

  var close = function (code, reason) {
    wsConn.close(code, reason);
  };

  var onReceive = function (type, key, func) {
    if (!wsConn) {
      connect(function () {});
    }
    if (!listeners[type]) {
      listeners[type] = {};
    }
    listeners[type][key] = func;
  };

  var cancelListener = function (type, key) {
    if (listeners[type]) {
      listeners[type][key] = null;
    }
  };

  var init = (onFirst) => {

    var url = (location.protocol === 'https:' ? 'wss' : 'ws') + '://' + location.host;// + (location.port ? ':' + location.port : '');// + '/api/ws';
    wsConn = new WebSocket(url);

    wsConn.onopen = onFirst;
    wsConn.onclose = function () {
      console.log('websocket connection closed. now trying connect again.');
      wsConn = null;
      // setTimeout(connect(function () {}), 10000);
    };
    wsConn.onerror = function (event) {
      whenErr();
    };
    wsConn.onmessage = function (event) {
      var data,
          key,
          funcs;
      if (event && event.data) {
        data = event.data;
        funcs = listeners[data.type].concat(listeners['ALL']);
        for (key in funcs) {
          if (funcs.hasOwnProperty(key) && funcs[key].toString() === 'Function') {
            funcs[key](data);
          }
        }
      }
    };
  };

  var connect = function (onFirst) {
    if (!wsConn) {
      init(onFirst);
    }
  };

  return {
    connect: connect,
    sendMessage: sendMessage,
    close: close,
    onReceive: onReceive,
    cancelListener: cancelListener,
  };
};

