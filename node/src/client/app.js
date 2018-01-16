import getFrame from './lib/frame';
import getAPI from './lib/xhr_mock';
import getWS from './lib/websocket_mock';
import getChannel from './lib/channel';
import getPhone from './lib/phone_mock';
import registerWebPush from './lib/webpush';

//applications
import menu from './app/menu';
import config from './app/config';
import relation from './app/relation';

window.addEventListener('DOMContentLoaded', function (event) {

  if (location.protocol === 'https:') {
    window.navigator.serviceWorker.register('/sw.js').catch(err => console.error(err));
  }

  const frame = getFrame(document);
  const api = getAPI(frame.whenErr);

  const startApplication = (userInfo) => {

    var ws;
    if (location.protocol === 'https:' && 'serviceWorker' in navigator) {
      ws = getChannel(frame.whenErr);
    } else {
      ws = getWS(frame.whenErr);
    }
    var phone = getPhone(ws);

    route.base('/');

    if (location.protocol === 'https:') {
      registerWebPush(api, window.navigator);
    }
    menu(frame, api, ws, riot, route);
    relation(frame, api, ws, riot, route, phone);
    config(frame, api, ws, riot, route);

    if (location.search) {
      route(location.pathname);
    } else {
      route.start(true);
    }
  };

  var query = api.getQueryDictionary(location.search),
      onetimePassword = query && query.onetime_password;

  api.login(null, null, null, (result) => {
    if (result.login) {
      startApplication(result.config);

    } else {
      frame.pause(true);
      frame.clear();
      frame.load('login', 'login', function () {
        riot.mount('login', 'login', {
          schema: onetimePassword,
          duties: {
            login: api.login,
            transfer: startApplication,
          }
        });
        frame.pause(false);
      });
    }
  });

});

