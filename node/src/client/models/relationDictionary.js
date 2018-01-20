'use strict';

const relation_request_size = 20;

const DDL = {
  name: 'relations',
  option: {keyPath:'userid'},
};

const getRelationsObj = (observe) => {
  const relationDic = {};
  observe(relationDic);

  relationDic.set = (relationAry) => {
    const len = relationAry.length;
    for (let i = 0; i < len; i++) {
      let obj = relationAry[i];
      let relation = relationDic[obj.relation_no] || {};

      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          relation[key] = obj[key];
        }
      }
      relationDic[obj.relation_no] = relation;
    }
  };
  return relationDic;
};

const getRelations = (api, offset, limit, callback) => {
  api.get('/api/v1/relation/', {
    offset: offset,
    limit: limit,
  }, callback);
};

const loadRelations = (api, relationDic, offset, resolve) => {

  let relationLoaded = false;

  const loop = (offsetInner) => {
    getRelations(api, offsetInner, relation_request_size, (result) => {
      relationDic.set(result.results);

      if (!relationLoaded) {
        relationLoaded = true;
        resolve();
      }
      if (result.hasNext) {
        setTimeout(loop.bind(null, offsetInner + relation_request_size), 1000);
      }
    });
  };
  loop(offset);
};

const listenWebSocket = function (relationDic, ws) {
  ws.onReceive('RELATE', 'relations', (payload) => {
    relationDic.set(payload);
  });
  return () => {
    ws.cancelListener('RELATE', 'relations');
  };
};

const fetchRelation = (db, transmitter, API_RELATION, request) => {
  const storeName = DDL.name;
  let parameters = request.url.slice(API_RELATION.length + 1).split(/&/);
  let userid;
  parameters.forEach((parameter) => {
    if (parameter.startsWith('userid')) {
      userid = parameter.slice('userid='.length);
    }
  });
  return transmitter.fetch(request)
    .then((response) => {
      if (response.ok) {
        return response.clone().body.getReader().read().then((body) => {
          const payload = JSON.parse(new TextDecoder().decode(body.value));
          let data;
          if (payload.hasOwnProperty('hasNext')) {
            data = payload.results;
          } else {
            data = payload;
          }
          db.put(storeName, data, console.log.bind(console, 'TODO'));

          return new transmitter.Response(body.value, {
            statue: response.status,
            statusText: response.statusText,
            headers: response.headers
          });
        });
      } else if (userid) {
        return new Promise((resolve) => {
          db.get(storeName, params.userid, resolve);
        }).then((result) => {
          return new transmitter.Response(JSON.stringify(result));
        });
      } else {
        return new Promise((resolve) => {
          db.getAll(storeName, resolve);
        }).then((result) => {
          return new transmitter.Response(JSON.stringify({hasNext: false, results: result}));
        });
      }
    });
};

export default {
  DDL,
  getRelationsObj,
  getRelations,
  loadRelations,
  listenWebSocket,
  fetchRelation,
};

