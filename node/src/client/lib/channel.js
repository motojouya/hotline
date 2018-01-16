
export default (whenErr) => {

  let channel;
  let sendMessageSW;
  const listeners = {};

  const sendMessage = (type, userid, contents) => {

    let message;
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
      connect(() => {
        sendMessageSW(message);
      });
    }
  };

  const closeWS = (code, reason) => {
    channel.port1.close();
  };

  const onReceive = (type, key, func) => {
    if (!channel) {
      connect(() => {});
    }
    if (!listeners[type]) {
      listeners[type] = {};
    }
    listeners[type][key] = func;
  };

  const cancelListener = (type, key) => {
    if (listeners[type]) {
      listeners[type][key] = null;
    }
  };

  const init = (onFirst) => {

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
    //var sendMessageSW = navigator.serviceWorker.controller.postMessage;
    sendMessageSW = (message, ports) => {
      navigator.serviceWorker.controller.postMessage(message, ports);
    };
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

  const connect = (onFirst) => {
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

