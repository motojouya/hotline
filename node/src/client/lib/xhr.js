import agent from 'superagent';

const relation_request_size = 20;
const voice_request_size = 100;

export default function (whenErr) {

  var login = function (userid, password, onetimePassword, callback) {
    agent.post('/api/v1/login')
      .send({
        userid: userid,
        password: password,
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

  var breakRelation = function (relationNo, callback) {
    agent.delete('/api/v1/relation/' + relationNo)
      .end(function (err, res) {
        if (err) {
          whenErr();
        }
        callback(res.body);
      });
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
    agent.get('/api/v1/relation/' + relation_no + '/voice')
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
    agent
      .put('/api/v1/config')
      .send(payload)
      .end(function (err, res) {
        if (err) {
          whenErr();
        }
        callback(res.body);
      });
  };

  var changePassword = function (payload, callback) {
    agent
      .put('/api/v1/config/password')
      .send(payload)
      .end(function (err, res) {
        if (err) {
          whenErr();
        }
        callback(res.body);
      });
  };

  var changeThumbnail = function (file, callback) {
    agent
      .put('/api/v1/config/thumbnail')
      .send({file: file})
      .end(function (err, res) {
        if (err) {
          whenErr();
        }
        callback(res.body);
      });
  };

  var loadRelations = function (offset, setRelations) {
    var callback = function cbRelations(result) {
      setRelations(result.results);
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

  const getVapidKey = (callback) => {
    agent
      .get('/api/v1/webpush/vapidkey')
      .end(function (err, res) {
        if (err) {
          whenErr();
        }
        callback(res.body.publicKey);
      });
  };

  const registerWebPush = (subscription, callback) => {
    agent
      .post('/api/v1/webpush/register')
      .send(subscription)
      .end(function (err, res) {
        if (err) {
          whenErr();
        }
        callback(res.body.result);
      });
  };

  return {
    getRelation: getRelation,
    makeRelation: makeRelation,
    breakRelation: breakRelation,
    getVoices: getVoices,
    getConfig: getConfig,
    changeConfig: changeConfig,
    changePassword: changePassword,
    changeThumbnail: changeThumbnail,
    loadRelations: loadRelations,
    getQueryDictionary: getQueryDictionary,
    login: login,
    getVapidKey: getVapidKey,
    registerWebPush: registerWebPush,
  };
};

