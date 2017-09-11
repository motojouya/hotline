import agent from 'superagent';

var connectWebSocket = function (callback, recover) {

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

  var wsSend = function (message) {
    wsConn.send(message);
  };
  var wsClose = function (code, reason) {
    wsConn.close(code, reason);
  };

  return {
    send: wsSend,
    close: wsClose,
  };
};

var makeRelation = function (userid, countersign, callback) {
  agent
    .post('/api/v1/relation/')
    .send({
      userid: userid
     ,countersign: countersign
    }).end(callback);
};

var breakRelation = function (userid, callback) {
  agent.delete('/api/v1/relation/' + userid).end(callback);
};

var getRelations = function (offset, limit, callback) {
  agent.get('/api/v1/relation')
    .query({
      offset
     ,limit
    }).end(callback);
};

var getVoices = function (relation_no, offset, limit, callback) {
  agent.get('/api/v1/voices/' + relation_no)
    .query({
      offset
     ,limit
    }).end(callback);
};

var getConfig = function (callback) {
  agent.get('/api/v1/config').end(callback);
};

var changeConfig = function (payload, callback) {
  agent.put('/api/v1/config').send(payload).end(callback);
};

var configThumbnail = function (file, callback) {
  agent.put('/api/v1/config').send({file: file}).end(callback);
};

export default {
  connectWebSocket
 ,getRelations
 ,makeRelation
 ,breakRelation
 ,getVoices
 ,getConfig
 ,changeConfig
 ,configThumbnail
};

