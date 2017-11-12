import agent from 'superagent';

const relation_request_size = 20;
const voice_request_size = 100;

export default function (whenErr) {

  var wsConn,
      listeners = {};

  var sendMessage = function (type, userid, message) {

    var msgObj;
    if (!message) {
      msgObj = {
        type: type,
        message: userid,
      };
    } else {
      msgObj = {
        type: type,
        userid: userid,
        message: message,
      };
    }

    if (wsConn) {
      wsConn.send(msgObj);
    } else {
      connectWebSocket(function () {
        wsConn.send(msgObj);
      });
    }
  };

  var closeWS = function (code, reason) {
    wsConn.close(code, reason);
  };

  var onReceive = function (type, key, func) {
    if (!wsConn) {
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

  var connectWebSocket = function (onFirst) {
  
    wsConn = new WebSocket('/api/ws');
  
    wsConn.onopen = onFirst;
    wsConn.onclose = function () {
      console.log('websocket connection closed. now trying connect again.');
      wsConn = null;
      setTimeout(connectWebSocket(callback, recover), 10000);
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
        funcs = listeners[data.type];
        for (key in funcs) {
          if (funcs.hasOwnProperty(key) && funcs[key].toString() === 'Function') {
            funcs[key](data);
          }
        }
      }
    };
  };
  
  var login = function (userid, password, onetimePassword, callback) {
    agent.post('/api/v1/login')
      .send({
        userid: userid,
        password: loginpassword,
        onetime_password: onetimePassword,
      }).end(function (err, res) {
        if (err) {
          whenErr();
        }
        callback(res.body);
      });
  };
  
  var makeRelation = function (userid, countersign, callback) {
    agent
      .post('/api/v1/relation/')
      .send({
        userid: userid,
        countersign: countersign,
      }).end(function (err, res) {
        if (err) {
          whenErr();
        }
        callback(res.body);
      });
  };
  
  var breakRelation = function (userid, callback) {
    agent.delete('/api/v1/relation/' + userid).end(callback);
  };
  
  var getRelation = function (relationNo, callback) {
    agent.get('/api/v1/relation')
      .query({
        relation_no: relationNo
      }).end(function (err, res) {
        if (err) {
          whenErr();
        }
        callback(res.body);
      });
  };
  
  var getRelations = function (offset, limit, callback) {
    agent.get('/api/v1/relation')
      .query({
        offset: offset,
        limit: limit,
      }).end(function (err, res) {
        if (err) {
          whenErr();
        }
        callback(res.body);
      });
  };
  
  var getVoices = function (relation_no, offset, limit, callback) {
    agent.get('/api/v1/voices/' + relation_no)
      .query({
        offset: offset,
        limit: limit,
      }).end(function (err, res) {
        if (err) {
          whenErr();
        }
        callback(res.body);
      });
  };
  
  var getConfig = function (callback) {
    agent.get('/api/v1/config').end(function (err, res) {
      if (err) {
        whenErr();
      }
      callback(res.body);
    });
  };
  
  var changeConfig = function (payload, callback) {
    agent.put('/api/v1/config').send(payload).end(function (err, res) {
      if (err) {
        whenErr();
      }
      callback(res.body);
    });
  };
  
  var configThumbnail = function (file, callback) {
    agent.put('/api/v1/config').send({file: file}).end(function (err, res) {
      if (err) {
        whenErr();
      }
      callback(res.body);
    });
  };
  
  var loadRelations = function (offset, setRelations) {
    var callback = function cbRelations(result) {
      setRelations(result.payload);
      if (result.hasNext) {
        setTimeout(getRelations(offset + payload.length, relation_request_size, cbRelations), 1000);
      }
    };
    getRelations(offset, relation_request_size, callback);
  };
  
  var getQueryDictionary = function (query) {
  
    if (!query) {
      return;
    }
    var paramEntry = query.slice(1).split('&'),
        i = 0,
        len = paramEntry.length,
        queryDic = {},
        queryItem;
  
    for (;i < len; i++) {
      queryItem = paramEntry[i].split('=');
      queryDic[queryItem[0]] = queryItem[1];
    }
    return queryDic;
  };

  return {
    connectWebSocket: connectWebSocket,
    getRelation: getRelation,
    makeRelation: makeRelation,
    breakRelation: breakRelation,
    getVoices: getVoices,
    getConfig: getConfig,
    changeConfig: changeConfig,
    configThumbnail: configThumbnail,
    loadRelations: loadRelations,
    getQueryDictionary: getQueryDictionary,
    login: login,
    sendMessage: sendMessage,
    closeWS: closeWS,
    onReceive: onReceive,
    cancelListener: cancelListener,
  };
};


