import getFrame from '../lib/frame';
import getAPI from '../lib/xhr_mock';
import getPhone from '../lib/phone_mock';

//applications
import menu from './menu';
import config from './config';
import relation from './relation';

var frame = getFrame(document),
    api = getAPI(frame.whenErr),
    phone = getPhone(api),
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

window.addEventListener('DOMContentLoaded', function (event) {

  menu(frame, api, riot, route);
  relation(frame, api, riot, route, phone);
  config(frame, api, riot, route);

  domLoaded = true;
  if (loginChecked !== 'NOTYET') {
    viewFirst(loginChecked);
  }
});

