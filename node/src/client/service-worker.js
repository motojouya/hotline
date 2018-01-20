'use strict';

import getDB from './lib/indexedDatabase';
import getWS from './lib/websocket';
import Cache from './lib/cache';
import ConfigUtils from './models/config';
import RelationUtils from './models/relationDictionary';
import VoiceUtils from './models/voice';

const OBJECT_STORES = {};
OBJECT_STORES.RELATIONS = RelationUtils.DDL
OBJECT_STORES.VOICES = VoiceUtils.DDL
OBJECT_STORES.CONFIG = ConfigUtils.DDL

const db = getDB(OBJECT_STORES);
const ws = getWS(console.log.bind(console, 'TODO'));
let messagePort;

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
const API_VOICE = API_ORIGIN + '/voice';

const transmitter = {
  fetch: fetch.bind(this),
  Request: Request.bind(this),
  Response: Response.bind(this),
};

const connectWebSocket = (resolve, reject) => {
  ws.connect();
  ws.onReceive('VOICE', 'sway_voice', (data) => {
    VoiceUtils.swayVoice(db, messagePort, data);
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
  resolve();
};

self.addEventListener('install', (event) => {
  event.waitUntil(Cache.loadCaches(caches, transmitter, STATIC_CACHE_NAME, STATIC_FILES));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(Promise.all([
    Cache.deleteOldCaches(caches, STATIC_CACHE_NAME),
    new Promise(connectWebSocket),
    self.clients.claim(),
  ]));
});

self.addEventListener('fetch', function(event) {

  let keptReq = event.request.clone();

  if (STATIC_FILES.indexOf(keptReq.url) !== -1) {
    return event.respondWith(caches.match(keptReq, {cacheName: STATIC_CACHE_NAME}));
  }
  if (keptReq.method === 'GET') {
    if (keptReq.url.startsWith(API_CONFIG)) {
      return event.respondWith(ConfigUtils.fetchConfig(db, transmitter, keptReq));
    }
    if (keptReq.url.indexOf('/voice') != -1) {
      return event.respondWith(VoiceUtils.fetchVoice(db, transmitter, API_RELATION, keptReq));
    }
    if (keptReq.url.startsWith(API_RELATION)) {
      return event.respondWith(RelationUtils.fetchRelation(db, transmitter, API_RELATION, keptReq));
    }
  }
});

self.addEventListener('message', (event) => {
  if (event.ports[0]) {
    messagePort = event.ports[0];
  }
  const promise = Promise
    .resolve()
    .then(() => {
      VoiceUtils.keepVoice(messagePort, ws, db, event.data);
    }).catch(error => {
      console.error(error);
    });
  event.waitUntil(promise);
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'send_voice') {
    VoiceUtils.syncVoices(ws, db);
  }
});

self.addEventListener('push', (event) => {
  const data = event.data.json();
  event.waitUntil(self.registration.showNotification(data.title, {
    body : data.body,
    icon: data.icon,
    data: {
      link_to: data.link
    },
    vibrate: [400,100,400],
  }));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.link_to));
});

