
export default function (whenErr) {

  const channel;
  const sendMessageSW;
  const listeners = {};

  var sendMessage = function (type, userid, contents) {

    var message;
    if (!contents) {
      message = {
        type: type,
        contents: userid,
      };
    } else {
      message = {
        type: type,
        userid: userid,
        contents: contents,
      };
    }

    if (channel) {
      sendMessageSW(message);
    } else {
      connectWebSocket(function () {
        sendMessageSW(message);
      });
    }
  };

  var closeWS = function (code, reason) {
    channel.port1.close();
  };

  var onReceive = function (type, key, func) {
    if (!channel) {
      connectWebSocket(function () {});
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

    channel = new MessageChannel();
    channel.port1.onmessage = (event) => {
      var data,
          key,
          funcs;
      if (event && event.data) {
        data = event.data;
        if (data.error) {
          console.log('TODO', event.data.error);
          return;
        }
        funcs = listeners[data.type];
        for (key in funcs) {
          if (funcs.hasOwnProperty(key) && funcs[key].toString() === 'Function') {
            funcs[key](data);
          }
        }
      }
    };
    sendMessageSW = navigator.serviceWorker.controller.postMessage;
    onReceive('SYNC', 'sync_request', (data) => {
      navigator.serviceWorker.ready.then(function(register) {
        return register.sync.register('send_voice');
      });
    });

    sendMessageSW('open channel', [channel.port2]);
    if (onFirst) {
      onFirst();
    }
  };

  var connect = function (onFirst) {
    if (!channel) {
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

