'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (win, doc, hstry, loc, xhr, store, mainTag, riot, pause) {

  var relation_request_size = 20;
  var voice_request_size = 100;

  var removeIfSuffix = function removeIfSuffix(path, suffix) {
    if (path.endsWith(suffix)) {
      path = path.slice(0, -1 * suffix.length);
    }
    return path;
  };

  var transfer = function transfer(href) {
    var path = removeIfSuffix(href, '/'),
        nextState;

    switch (path) {
      case '/app':
        nextState = { pane: 'menu' };
        hstry.pushState(nextState, 'menu', href);
        return;
      case '/app/config':
        nextState = { pane: 'config' };
        hstry.pushState(nextState, 'config', href);
        return;
      case '/app/relation':
        nextState = { pane: 'relation' };
        hstry.pushState(nextState, 'relation', href);
        return;
      default: //do nothing
    }
    if (path.startsWith('/app/relation/')) {
      nextState = {
        pane: 'relation',
        relationNo: path.slice('/app/relation/'.length).split('/')[0]
      };
      hstry.pushState(nextState, 'relation', href);
      return;
    }
  };

  var changeConfig = function changeConfig(payload) {
    xhr.changeConfig(payload, function (err, res) {
      var data, key;
      if (err) {
        return;
      }
      data = res.body;
      for (key in data) {
        if (data.hasOwnProperty(key)) {
          store.setConfig(key, data[key]);
        }
      }
    });
  };

  var configThumbnail = function configThumbnail(file) {
    xhr.configThumbnail(file, function (err, res) {
      if (err) {
        return;
      }
      store.setConfig('thumbnail', res.body.payload);
    });
  };

  var configLoginPassword = function configLoginPassword(oldPassword, newPassword) {
    var payload = {
      oldPassword: oldPassword,
      newPassword: newPassword
    };
    xhr.changeConfig(payload, function (err, res) {
      if (err) {
        return;
      }
      alert('passwordを変更しました');
    });
  };

  var makeRelation = function makeRelation(userid, countersign) {
    xhr.makeRelation(userid, countersign, function (err, res) {
      var data;
      if (err) {
        return;
      }
      data = res.body;
      store.setRelation(data.userid, data);
    });
  };

  var breakRelation = function breakRelation(userid) {
    xhr.breakRelation(userid, function (err, res) {
      var data;
      if (err) {
        return;
      }
      data = res.body;
      store.setRelation(data.userid, data);
    });
  };

  var wsConn = null;

  var makeWSConnction = function makeWSConnction() {
    wsConn = xhr.connectWebSocket(function (data) {
      switch (data.type) {
        case 'RELATION':
          store.setRelations(data.relations);
        case 'VOICE':
          store.setVoices(data.userid, data.voices);
        default: //do nothing
      }
    });
  };

  var sendWSMessage = function sendWSMessage(payload) {
    wsConn.send(payload);
  };

  var closeWSConnection = function closeWSConnection(code, reason) {
    wsConn.close(code, reason);
  };

  var loadRelations = function loadRelations(offset) {
    xhr.getRelations(offset, relation_request_size, function (err, res) {
      var data, payload;
      if (err) {
        return;
      }
      data = res.body;
      payload = data.payload;
      store.setRelations(payload);
      if (data.hasNext) {
        getRelations(offset + payload.length);
      }
    });
  };

  var loadConfig = function loadConfig() {
    xhr.getConfig(function (err, res) {
      if (err) {
        return;
      }
      store.setConfig(res.body.payload);
    });
  };

  var replaceInitialState = function replaceInitialState(href, pathName) {

    var path = removeIfSuffix(pathName, '/'),
        firstLoadedState;

    switch (path) {
      case '/app':
        firstLoadedState = { pane: 'menu' };
        hstry.replaceState(firstLoadedState, 'menu', href);
        return firstLoadedState;
      case '/app/config':
        firstLoadedState = { pane: 'config' };
        hstry.replaceState(firstLoadedState, 'config', href);
        return firstLoadedState;
      case '/app/relation':
        firstLoadedState = { pane: 'relation' };
        hstry.replaceState(firstLoadedState, 'relation', href);
        return firstLoadedState;
      default: //do nothing
    }
    if (path.startsWith('/app/relation/')) {
      firstLoadedState = {
        pane: 'relation',
        relationNo: path.slice('/app/relation/'.length).split('/')[0]
      };
      hstry.replaceState(firstLoadedState, 'relation', href);
      return firstLoadedState;
    }
  };

  var domItems = {};

  var change = function change(tagName, tagId, opts) {

    var div = doc.createElement('div'),
        tag = doc.createElement('menu'),
        script = doc.createElement('script');

    for (var key in domItems) {
      if (domItems.hasOwnProperty(key)) {
        domitems[key].parentNode.removeChild(domitems[key]);
      }
    }
    pause(true);

    script.onload = function () {
      riot.mount('#' + tagId, tagName, opts);
      pause(false);
    };
    script.src = '/lib/' + tagname + '.tag';
    div.apendChild(script);
    div.apendChild(tag);
    div.setAttribute('id', tagId);

    mainTag.apendChild(div);
    domItems[tagId] = div;
  };

  var changeState = function changeState(state) {
    switch (state.pane) {

      case 'menu':
        return change('menu', 'menu', {
          schema: store.getRelations(),
          duties: { transfer: transfer }
        });

      case 'config':
        return change('config', 'config', {
          schema: store.getConfig(),
          duties: {
            changeConfig: changeConfig,
            configThumbnail: configThumbnail,
            configLoginPassword: configLoginPassword,
            transfer: transfer
          }
        });

      case 'relation':
        var relation = store.getRelation(state.relationNo);

        if (relation && relation.status == 'ACTIVE') {
          return change('chat' + relationNo, 'chat', {
            schema: {
              relation: relation,
              voices: store.getVoices(relation.userid)
            },
            duties: {
              sendMessage: sendWSMessage,
              breakRelation: breakRelation,
              transfer: transfer
            }
          });
        } else {
          return change('relate', 'relate', {
            schema: relation,
            duties: {
              makeRelation: makeRelation,
              breakRelation: breakRelation,
              transfer: transfer
            }
          });
        }

      default: //do nothing
    }
  };

  var init = function init() {
    loadRelations(0);
    loadConfig();
    makeWSConnction();
    win.addEventListener('popstate', function (event) {
      changeState(event.state);
    });
    changeState(replaceInitialState(loc.href, loc.pathname));
  };

  init();
};

;