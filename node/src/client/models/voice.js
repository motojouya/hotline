'use strict';

const voice_request_size = 100;

const DDL = {
  name: 'voices',
  option: {keyPath:'side_time'},
  func: (objectStore) => {
    objectStore.createIndex('other_side', 'other_side', { unique: false });
  },
};

const getVoicesObj = (observe) => {
  const voices = [];
  observe(voices);

  voices.set = (result) => {
    const len = result.length;
    for (let i = 0; i < len; i++) {
      voices.push(result[i]);
    }
    voices.trigger('change');
  };

  voices.add = (result, commit) => {
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

const getVoices = (api, relation_no, offset, limit, callback) => {
  api.get('/api/v1/relation/' + relation_no + '/voice', {
    offset: offset,
    limit: limit,
  }, callback);
};

const loadVoices = (api, voices, relation_no, offset, limit, callback) => {
  getVoices(api, relation_no, offset, limit, (result) => {
    voices.set(result.results);
    callback(result);
  })
};

const listenWebSocket = (voices, relationNo, ws) => {
  ws.onReceive('VOICE', 'relate' + relationNo, (payload) => {
    if (relationNo == payload.contents.relation_no) {
      voices.add(payload.contents.voice, payload.contents.commit);
    }
  });
  return (path) => {
    ws.cancelListener('VOICE', 'relate' + relationNo);
  }
};

const sendMessage = (ws, relation, voices, config, contents) => {
  if (contents.commit) {
    voices.add({
      spoken_at: '',
      userid: config.userid,
      sentence: contents.sentence,
    }, contents.commit);
  }
  ws.sendMessage('VOICE', relation.userid, contents);
};

const fetchVoice = (db, transmitter, API_RELATION, request) => {
  let userid = request.url.slice(API_RELATION.length + 1).split(/\//)[0];
  const storeName = DDL.name;
  return transmitter.fetch(request)
    .then((response) => {
      if (response.ok) {
        return response.clone().body.getReader().read().then((body) => {
          let voices = JSON.parse(new TextDecoder().decode(body.value)).results.map((voice) => {
            voice.other_side = userid;
            voice.side_time = userid + '_' + voice.spoken_at;
            voice.saved = true;
            return voice;
          });
          db.put(storeName, voices, console.log.bind(console, 'TODO'));
          return new transmitter.Response(body.value, {
            statue: response.status,
            statusText: response.statusText,
            headers: response.headers
          });
        });
      } else {
        return new Promise((resolve) => {
          db.getByIndexOnly(storeName, 'other_side', userid, 'prev', resolve);
        }).then((result) => {
          return new transmitter.Response(JSON.stringify(result));
        });
      }
    });
};

const keepVoice = (messagePort, ws, db, data) => {
  if (!data || 'object' !== typeof data) {
    return;
  }
  if (ws) {
    ws.sendMessage(data);
  } else {
    messagePort.postMessage('sync_send_voice');
    let voice = data.contents
    voice.other_side = data.userid;
    voice.side_time = data.userid + '_' + voice.spoken_at;
    voice.saved = false;
    db.put(DDL.name, voice, console.log.bind(console, 'TODO'));
  }
};

const syncVoices = (ws, db) => {
  ws.connectWebSocket();
  db.getByIndexOnly(DDL.name, 'saved', true, 'next', (result) => {
    result.forEach((item) => {
      var message = {
        type: 'VOICE',
        userid: item.other_side,
        contents: item,
      };
      ws.sendMessage(message);
    });
    ws.closeWS();
  });
};

const swayVoice = (db, messagePort, data) => {

  let voice = data.contents
  voice.other_side = data.userid;
  voice.side_time = data.userid + '_' + voice.spoken_at;
  voice.saved = true;
  db.put(DDL.name, voice, console.log.bind(console, 'TODO'));

  messagePort.postMessage(data);
};

export default {
  DDL,
  getVoicesObj,
  getVoices,
  loadVoices,
  listenWebSocket,
  sendMessage,
  fetchVoice,
  keepVoice,
  syncVoices,
  swayVoice,
};

