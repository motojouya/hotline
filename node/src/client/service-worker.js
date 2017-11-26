'use strict';

import getDB from './lib/indexedDatabase';
import getWS from './lib/websocket';

const db = getDB();
const ws = getWS(() => {console.log('TODO');});
const messagePort;

const VERSION = 1;
const STATIC_CACHE_NAME = 'statics_v' + VERSION;
const ORIGIN = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
const STATIC_FILES = [
  ORIGIN + '/app/',
  ORIGIN + '/app/bundle.min.js',
  ORIGIN + '/app/main.css',
  ORIGIN + '/app/tag/chat.js',
  ORIGIN + '/app/tag/config.js',
  ORIGIN + '/app/tag/menu.js',
  ORIGIN + '/app/tag/relate.js',
  ORIGIN + '/app/tag/login.js',
  ORIGIN + '/register/',
  ORIGIN + '/register/bundle.min.js',
  ORIGIN + '/register/main.css',
];

const API_ORIGIN = ORIGIN + '/api/v1';
const API_CONFIG = API_ORIGIN + '/config';
const API_RELATION = API_ORIGIN + '/relation';
const API_VOICE = API_ORIGIN + '/voices';

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(STATIC_CACHE_NAME).then((cache) => {
    return Promise.all(STATIC_FILES.map((url) => {
      return fetch(new Request(url)).then((response) => {
        if (response.ok) {
          return cache.put(response.url, response);
        } else {
          return Promise.reject('Invalid response.  URL:' + response.url + ' Status: ' + response.status);
        }
      });
    }));
  }));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(() => {
    caches.keys().then((keys) => {
      var promises = [];
      keys.forEach((cacheName) => {
        if (STATIC_CACHE_NAME !== cacheName) {
          promises.push(caches.delete(cacheName));
        }
      });
      return Promise.all(promises);
    });

    ws.connect();
    ws.onReceive('VOICE', 'sway_voice', (data) => {

      let voice = data.contents
      voice.other_side = data.userid;
      voice.side_time = data.userid + voice.spoken_at.toISOString();
      voice.saved = true;
      db.put(db.OBJECT_STORES.VOICE.name, voice, () => {console.log('TODO');});

      messagePort.postMessage(data);
    });
    ws.onReceive('ICE', 'sway_ice', (data) => {
      messagePort.postMessage(data);
    });
    ws.onReceive('CALL', 'sway_call', (data) => {
      messagePort.postMessage(data);
    });
    ws.onReceive('HUNGOFF', 'sway_hungoff', (data) => {
      messagePort.postMessage(data);
    });

    self.clients.claim();
  });
});

const getConfig = (request) => {
  const storeName = db.OBJECT_STORES.CONFIG.name;
  return fetch(request)
    .then((response) => {
      if (response.ok) {
        let keptRes = response.clone();
        let payload = JSON.parse(keptRes.body);
        db.put(storeName, payload, () => {console.log('TODO');});
        return keptRes;
      } else {
        return new Promise((resolve) => {
          db.get(storeName, null, resolve);
        }).then((result) => { 
          return new Response(JSON.stringify(result));
        });
      }
    });
};

const getRelation = (request, userid) => {
  const storeName = db.OBJECT_STORES.RELATION.name;
  return fetch(request)
    .then((response) => {
      if (response.ok) {
        let keptRes = response.clone();
        let payload = JSON.parse(keptRes.body);
        let data;
        if (payload.hasOwnProperty('hasNext');) {
          data = payload.results;
        } else {
          data = payload;
        }
        db.put(storeName, data, () => {console.log('TODO');});
        return keptRes;
      } else if (userid) {
        return new Promise((resolve) => {
          db.get(storeName, params.userid, resolve);
        }).then((result) => {
          return new Response(JSON.stringify(result));
        });
      } else {
        return new Promise((resolve) => {
          db.getAll(storeName, resolve);
        }).then((result) => {
          return new Response(JSON.stringify({hasNext: false, results: result}));
        });
      }
    });
};

const getVoice = (request, userid) => {
  const storeName = db.OBJECT_STORES.VOICE.name;
  return fetch(request)
    .then((response) => {
      if (response.ok) {
        let keptRes = response.clone();
        let payload = JSON.parse(keptRes.body);
        payload.forEach((voice) => {
          voice.other_side = userid;
          voice.side_time = userid + voice.spoken_at.toISOString();
          voice.saved = true;
        });
        db.put(storeName, payload, () => {console.log('TODO');});
        return keptRes;
      } else {
        return new Promise((resolve) => {
          db.getByIndexOnly(storeName, 'other_side', userid, 'prev', resolve);
        }).then((result) => {
          return new Response(JSON.stringify(result));
        });
      }
    });
};

self.addEventListener('fetch', function(event) {

  let keptReq = event.request.clone();
  if (STATIC_FILES.index(keptReq.url) !== -1) {
    event.respondWith(caches.match(keptReq, {cacheName: STATIC_CACHE_NAME}));
    return;
  }
  if (keptReq.method === 'GET') {
    if (keptReq.url.startsWith(API_CONFIG)) {
      event.respondWith(getConfig(keptReq));
      return;
    }
    if (keptReq.url.startsWith(API_RELATION)) {
      let parameters = keptReq.url.slice(API_VOICE.length + 1).split(/\?/)[1].split(/&/);
      let userid;
      parameters.forEach((parameter) => {
        if (parameter.startsWith('userid')) {
          userid = parameter.slice('userid='.length);
        }
      });
      event.respondWith(getRelation(keptReq, userid));
      return;
    }
    if (keptReq.url.startsWith(API_VOICE)) {
      let userid = keptReq.url.slice(API_VOICE.length + 1).split(/\//)[0];
      event.respondWith(getVoice(keptReq, userid));
      return;
    }
  }
});

self.addEventListener('push', (event) => {
  const data = event.data.json();
  const title = data.title;
  const options = {
    body : data.body,
    icon: data.icon,
    data: {
      link_to: data.link
    },
    vibrate: [400,100,400],
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.link_to));
});

const keepVoice = (event) => {
  let data = event.data;
  let voice = data.contents
  voice.other_side = data.userid;
  voice.side_time = data.userid + voice.spoken_at.toISOString();

  if (ws) {
    ws.sendMessage(data);
    voice.saved = true;
  } else {
    voice.saved = false;
    messagePort.postMessage('sync_send_voice');
  }
  db.put(db.OBJECT_STORES.VOICE.name, voice, () => {console.log('TODO');});
};

self.addEventListener('message', (event) => {

  if (event.ports[0]) {
    messagePort = event.ports[0];
  }
  let promise = Promise.resolve()
    .then(() => {
      keepVoice(event);
    }).catch(error => {
      console.error(error);
    });
  e.waitUntil(promise);
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'send_voice') {
    ws.connectWebSocket();
    db.getByIndexOnly(db.OBJECT_STORES.VOICE.name, 'saved', true, 'next', (result) => {
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
  }
});

