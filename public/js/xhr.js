'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var connectWebSocket = function connectWebSocket(callback, recover) {

  var wsConn = new WebSocket('/api/ws');

  wsConn.onopen = function () {};
  wsConn.onclose = function () {
    console.log('websocket connection closed. now trying connect again.');
    wsConn = null;
    setTimeout(connectWebSocket(callback, recover), 10000);
  };
  wsConn.onmessage = function (event) {
    if (event && event.data) {
      callback(event.data);
    }
  };
  wsConn.onerror = function (event) {
    if (event && event.data) {
      recover(event.data);
    }
  };

  var wsSend = function wsSend(message) {
    wsConn.send(message);
  };
  var wsClose = function wsClose(code, reason) {
    wsConn.close(code, reason);
  };

  return {
    send: wsSend,
    close: wsClose
  };
};

var makeRelation = function makeRelation(userid, countersign, callback) {
  _superagent2.default.post('/api/v1/relation/').send({
    userid: userid,
    countersign: countersign
  }).end(callback);
};

var breakRelation = function breakRelation(userid, callback) {
  _superagent2.default.delete('/api/v1/relation/' + userid).end(callback);
};

var getRelations = function getRelations(offset, limit, callback) {
  _superagent2.default.get('/api/v1/relation').query({
    offset: offset,
    limit: limit
  }).end(callback);
};

var getVoices = function getVoices(userid, offset, limit, callback) {
  _superagent2.default.get('/api/v1/voices/' + userid).query({
    offset: offset,
    limit: limit
  }).end(callback);
};

var getConfig = function getConfig(callback) {
  _superagent2.default.get('/api/v1/config').end(callback);
};

var changeConfig = function changeConfig(payload, callback) {
  _superagent2.default.put('/api/v1/config').send(payload).end(callback);
};

var configThumbnail = function configThumbnail(file, callback) {
  _superagent2.default.put('/api/v1/config').send({ file: file }).end(callback);
};

exports.default = {
  connectWebSocket: connectWebSocket,
  getRelations: getRelations,
  makeRelation: makeRelation,
  breakRelation: breakRelation,
  getVoices: getVoices,
  getConfig: getConfig,
  changeConfig: changeConfig,
  configThumbnail: configThumbnail
};