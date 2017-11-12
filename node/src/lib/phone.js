
const iceConfig = {'iceServers': [
  {'url': 'stun:stunserver.com:12345'},
  {'url': 'turn:user@turnserver.com', 'credential':'pass'}
]};

var phone = null,
    peerConn = null;
var logError = function (message) {
  console.log(message);
};

export default function (ws) {
  if (phone) {
    return phone;
  }
  phone = {};
  phone.state = 'WAITING';

  var listener = {};

  var getPeerConnection = function (setStream) {
    var peerConn = new RTCPeerConnection(iceConfig);
    peerConn.onicecandidate = function (event) {
      if (event.candidate) {
        ws.sendMessage('ICE', phone.userid, event.candidate);
      }
    };
    peerConn.onaddstream = function (event) {
      setStream('REMOTE', event.stream);
    };
    return peerConn;
  };

  var onCreate = function (answer) {
    peerConn.setLocalDescription(answer);
    ws.sendMessage('CALL', phone.userid, answer.sdp);
  };

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

  ws.onReceice('CALL', 'uniqueReceiver', function (data) {

    if (phone.state === 'WAITING' && !peerConn) {
      phone.userid = data.userid;
      phone.remote = data.sdp;
      phone.changeState('RECEIVING');

    } else if (phone.state === 'CALLING' && peerConn && phone.userid === data.userid) {
      phone.remote = data.sdp;
      peerConn.setRemoteDescription(phone.remote);
      phone.changeState('SPEAKING');

    } else {
      ws.sendMessage('CALLOFF', phone.userid, 'this phone is busy.');
    }
  });

  ws.onReceice('ICE', 'uniqueReceiver', function (message) {
    peerConn.addIceCandidate(cadidate);
  });

  ws.onReceice('CALLOFF', 'uniqueReceiver', function (message) {
    peerConn = null;
    phone.changeState('WAITING');
  });

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
      peerConn = getPeerConnection(setStream);
      navigator.getUserMedia({'audio': true, 'video': true}, function (event) {
          peerConn.addStream(event.stream);
          setStream('LOCAL', event.stream);
          peerConn.createOffer(onCreate);
        }, logError);
      phone.changeState('CALLING');
    }
  };

  phone.answer = function (setStream) {
    if (phone.state === 'RECEIVING') {
      peerConn = getPeerConnection(setStream);
      peerConn.setRemoteDescription(phone.remote);
      navigater.getUserMedia({'audio': true, 'video': true}, function (event) {
          peerConn.addStream(event.stream);
          setStream('LOCAL', event.stream);
          peerConn.createAnswer(onCreate);
        }, logError);
      phone.changeState('SPEAKING');
    }
  };

  phone.hangUp = function () {
    if (phone.state !== 'WAITING') {
      ws.sendMessage('CALLOFF', phone.userid, 'bye!');
      peerConn = null;
      phone.changeState('WAITING');
    }
  };

  return phone;
};

