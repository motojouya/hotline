
var phone = null;

export default function (ws) {
  if (phone) {
    return phone;
  }
  phone = {};
  phone.state = 'WAITING';

  var listener = {};

  phone.changeState = function (state) {
    var key,
        stateListener = listener[state];

    phone.state = state;
    if (!stateListener) {
      listener[state] = {};
      return;
    }
    for (key in stateListener) {
      if (stateListener.hasOwnProperty(key)) {
        stateListener[key]();
      }
    }
  };

  phone.onStateChange = function (state, key, func) {
    var stateListener = listener[state];
    if (!listener[state]) {
      listener[state] = {};
    }
    listener[state][key] = func;
  };

  phone.call = function (userid, setStream) {
    if (phone.state === 'WAITING') {
      phone.userid = userid;
      phone.changeState('CALLING');
    }
  };

  phone.answer = function (setStream) {
    if (phone.state === 'RECEIVING') {
      phone.changeState('SPEAKING');
    }
  };

  phone.hangUp = function () {
    if (phone.state !== 'WAITING') {
      phone.changeState('WAITING');
    }
  };

  return phone;
};

