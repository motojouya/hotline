import serializeColor from '../../lib/colors';

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

  voices.set = function (result) {
    var i = 0,
        len = result.length;
    for (; i < len; i++) {
      voices.push(result[i]);
    }
    voices.trigger('change');
  };

  voices.add = function (result, commit) {
    if (!commit) {
      voices.editting = result;
    } else {
      voices.unshift(result);
      voices.editting = null;
    }
    voices.trigger('change');
  };

  return voices;
};

var connect = function (relation, voices, relationNo, ws) {
  ws.onReceive('RELATE', 'relate' + relationNo, function (payload) {
    if (payload[relation_no]) {
      relation.set(payload[relation_no]);
    }
  });
  ws.onReceive('VOICE', 'relate' + relationNo, function (payload) {
    if (relationNo == payload.contents.relation_no) {
      voices.add(payload.contents.voice, payload.contents.commit);
    }
  });

  return function (path) {
    ws.cancelListener('RELATE', 'relate' + relationNo);
    ws.cancelListener('VOICE', 'relate' + relationNo);
    route(path);
  }
};

export default function (frame, api, ws, riot, route, phone) {

  var display = function (relationNo) {
    var relation = getRelationObj(riot.observable),
        voices = getVoicesObj(riot.observable),
        config,
        transfer = connect(relation, voices, relationNo, ws),
        voiceLoaded = false,
        domLoaded = false,
        configLoaded = false;

    var buildChat = function () {
      riot.mount('section#chat' + relationNo + ' > chat', 'chat', {
        schema: {
          relation: relation,
          voices: voices,
          config: config,
        },
        duties: {
          transfer: transfer,
          serializeColor: serializeColor,
          sendMessage: function (contents) {
            ws.sendMessage('VOICE', relation.userid, contents);
            if (contents.commit) {
              voices.add({
                spoken_at: '',
                userid: config.userid,
                sentence: contents.sentence,
              }, contents.commit);
            }
          },
          breakRelation: function (relationNo) {
            api.breakRelation(relationNo, function (result) {
              if (result.breaks) {
                relation.set(result.relation);
                transfer('/app/');
              } else {
                alert('削除できませんでした');
              }
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

    api.getConfig(function (result) {
      config = result;
      if (domLoaded && voiceLoaded && relation && relation.status == 'ACTIVE') {
        buildChat();
      }
      configLoaded = true;
    });

    api.getRelation(relationNo, function (result) {
      relation.set(result);

      if (relation && relation.status == 'ACTIVE') {
        frame.load('chat' + relationNo, 'chat', function () {
          domLoaded = true;
          if (voiceLoaded && configLoaded) {
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
                  if (result.make) {
                    relation.set(result.relation);
                    transfer('/app/');
                  } else {
                    alert('申請できませんでした');
                  }
                });
              },
              breakRelation: function (relationNo) {
                api.breakRelation(relationNo, function (result) {
                  if (result.breaks) {
                    relation.set(result.relation);
                    transfer('/app/');
                  } else {
                    alert('削除できませんでした');
                  }
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
      voices.set(result.results);
      voiceLoaded = true;
      if (domLoaded && configLoaded && relation && relation.status == 'ACTIVE') {
        buildChat();
      }
    });
  };

  route('app/relation/*', display);

  route('app/relation', function (relationNo) {

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
              if (result.make) {
                relation.set(result.relation);
                route('/app/');
              } else {
                alert('申請できませんでした');
              }
            });
          },
          breakRelation: function (relationNo) {
            api.breakRelation(relationNo, function (result) {
              if (result.breaks) {
                relation.set(result.relation);
                route('/app/');
              } else {
                alert('削除できませんでした');
              }
            });
          },
        },
      });
      frame.pause(false);
    });
  });

  phone.onStateChange('RECEIVING', 'receiveRoot', display);
};

