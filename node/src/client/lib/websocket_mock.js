export default function (whenErr) {

  var listeners = {};

  var sendMessage = function (type, userid, payload) {
    voices.unshift({
      no: payload.relationNo,
      speak_at: "2017-07-02 10:10:10",
      userid: "matsumoto",
      message: payload.message,
      meta_flag: null,
      file_no: null,
      tel_flag: null
    });
  };

  var connectWebSocket = function (onFirst) {
    onFirst();
  };

  var closeWS = function (code, reason) {};

  var onReceive = function (type, key, func) {
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

  return {
    connectWebSocket: connectWebSocket,
    sendMessage: sendMessage,
    closeWS: closeWS,
    onReceive: onReceive,
    cancelListener: cancelListener,
  };

};

