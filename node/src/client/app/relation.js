import serializeColor from '../lib/colors';

var getRelationObj = function (observe) {
  var relation = {};
  observe(relation);

  relation.set = function (result) {
    var key;
    for (key in result) {
      if (result.hasOwnProperty(key)) {
        relation[key] = result[key];
      }
    }
    relation.trigger('change');
  };
  return relation;
};

var getVoicesObj = function (observe) {
  var voices = [];
  observe(voices);

  voices.set = function (result, order) {
    var i = 0,
        len = result.length;
    for (; i < len; i++) {
      if (order === 'NEW') {
        voices.unshift(result[i]);
      } else {
        voices.push(result[i]);
      }
    }
    voices.trigger('change');
  };
  return voices;
};

var connect = function (relation, voices, relationNo, api) {
  api.onReceive('RELATE', 'relate' + relationNo, function (payload) {
    if (payload[relationNo]) {
      relation.set(payload[relationNo]);
    }
  });
  api.onReceive('VOICE', 'relate' + relationNo, function (payload) {
    if (payload[relationNo]) {
      voices.set(payload[relationNo], payload.order);
    }
  });

  return function (path) {
    api.cancelListener('RELATE', 'relate' + relationNo);
    api.cancelListener('VOICE', 'relate' + relationNo);
    route(path);
  }
};

export default function (frame, api, ws, riot, route, phone) {

  var display = function (relationNo) {
    var relation = getRelationObj(riot.observable),
        voices = getVoicesObj(riot.observable),
        transfer = connect(relation, voices, relationNo, api),
        voiceLoaded = false,
        domLoaded = false;

    var buildChat = function () {
      riot.mount('section#chat' + relationNo + ' > chat', 'chat', {
        schema: {
          relation: relation,
          voices: voices,
        },
        duties: {
          transfer: transfer,
          serializeColor: serializeColor,
          sendMessage: function (message) {
            ws.sendMessage('VOICE', relation.userid, {
              relationNo: relationNo,
              message: message,
            });
          },
          breakRelation: function (userid) {
            api.breakRelation(userid, function (result) {
              relation.set(result.payload);
            });
          },
          getSrc: frame.getSrc,
        },
        phone: phone,
      });
      frame.pause(false);
    };

    frame.pause(true);
    frame.clear();

    api.getRelation(relationNo, function (result) {
      relation.set(result);

      if (relation && relation.status == 'ACTIVE') {
        frame.load('chat' + relationNo, 'chat', function () {
          domLoaded = true;
          if (voiceLoaded) {
            buildChat();
          }
        });

      } else {
        frame.load('relate' + relationNo, 'relate', function () {
          riot.mount('section#relate' + relationNo + ' > relate', 'relate', {
            schema: relation,
            duties: {
              transfer: transfer,
              makeRelation: function (userid, countersign) {
                api.makeRelation(userid, countersign, function (result) {
                  relation.set(result.payload);
                });
              },
              breakRelation: function (userid) {
                api.breakRelation(userid, function (result) {
                  relation.set(result.payload);
                });
              },
            },
          });
          frame.pause(false);
        });
      }
    });
    //TODO スクロールした場合にvoiceを再取得
    api.getVoices(relationNo, 0, 20, function (result) {
      voices.set(result.payload, 'OLD');
      voiceLoaded = true;
      if (domLoaded && relation && relation.status == 'ACTIVE') {
        buildChat();
      }
    });
  };

  route('/app/relation/*', display);

  route('/app/relation', function (relationNo) {

    var relation;
    frame.pause(true);
    frame.clear();

    frame.load('relate_new', 'relate', function () {
      riot.mount('section#relate_new > relate', 'relate', {
        schema: relation,
        duties: {
          transfer: route,
          makeRelation: function (userid, countersign) {
            api.makeRelation(userid, countersign, function (result) {
              relation = getRelationObj(riot.observable);
              relation.set(result.payload);
            });
          },
          breakRelation: function (userid) {
            api.breakRelation(userid, function (result) {
              relation.set(result.payload);
            });
          },
        },
      });
      frame.pause(false);
    });
  });

  phone.onStateChange('RECEIVING', 'receiveRoot', display);
};

