import getFrame from './lib/frame';
import getAPI from './lib/xhr_mock';
import getWS from './lib/websocket';
import getChannel from './lib/channel';
import getPhone from './lib/phone_mock';
import registerWebPush from './lib/webpush';

//applications
import menu from './app/menu';
import config from './app/config';
import relation from './app/relation';

window.addEventListener('DOMContentLoaded', function (event) {

  window.navigator.serviceWorker.register("service-worker.js").catch(console.error.bind(console));

  var frame = getFrame(document),
      api = getAPI(frame.whenErr),
      ws;

  if ('serviceWorker' in navigator) {
    ws = getChannel(frame.whenErr);
  } else {
    ws = getWS(frame.whenErr);
  }

  var phone = getPhone(ws),
      loginChecked = 'NOTYET',
      domLoaded = false,
      query = api.getQueryDictionary(location.search),
      onetimePassword;

  if (query) {
    onetimePassword = query.onetimePassword;
  }

  var viewFirst = function (logined) {

    if (logined === 'SUCCESS') {
      route(location.pathname);//TODO pathname? href?

    } else if (logined === 'FAILURE') {
      frame.pause(true);
      frame.clear();
      frame.load('menu', 'menu', function () {
        riot.mount('login', 'login', {
          schema: onetimePassword,
          duties: {transfer: function () {
            route(location.pathname);//TODO pathname? href?
          }}
        });
        frame.pause(false);
      });
    }
  };

  api.login(null, null, null, function (isSuccess) {
    if (isSuccess) {
      loginChecked = 'SUCCESS';
    } else {
      loginChecked = 'FAILURE';
    }
    if (domLoaded) {
      viewFirst(loginChecked);
    }
  });

  registerWebPush(api, window.navigator);
  menu(frame, api, riot, route);
  relation(frame, api, getWS(), riot, route, phone);
  config(frame, api, riot, route);

  domLoaded = true;
  if (loginChecked !== 'NOTYET') {
    viewFirst(loginChecked);
  }
});

