'use strict';

const getRelationObj = (observe) => {
  const relation = {};
  observe(relation);

  relation.set = (result) => {
    for (let key in result) {
      if (result.hasOwnProperty(key)) {
        relation[key] = result[key];
      }
    }
    relation.trigger('change');
  };
  return relation;
};

const makeRelation = (api, userid, countersign, callback) => {
  api.post('/api/v1/relation/', {
    userid: userid,
    countersign: countersign,
  }, callback);
};

const breakRelation = (api, relationNo, callback) => {
  api.del('/api/v1/relation/' + relationNo, callback);
};

const getRelation = (api, relationNo, callback) => {
  api.get('/api/v1/relation/', {
    relation_no: relationNo
  }, callback);
};

const listenWebSocket = (relation, relationNo, ws) => {
  ws.onReceive('RELATE', 'relate' + relationNo, (payload) => {
    if (payload[relation_no]) {
      relation.set(payload[relation_no]);
    }
  });
  return (path) => {
    ws.cancelListener('RELATE', 'relate' + relationNo);
  }
};

export default {
  getRelationObj,
  makeRelation,
  breakRelation,
  getRelation,
  listenWebSocket,
};

