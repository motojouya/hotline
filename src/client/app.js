export default function (win, doc, hstry, loc, xhr, getStore, mainTag, riot, pause) {

  const relation_request_size = 20;
  const voice_request_size = 100;
  const store = getStore(riot.observable);

  var removeIfSuffix = function (path, suffix) {
    if (path.endsWith(suffix)) {
      path = path.slice(0, (-1 * suffix.length));
    }
    return path;
  };

  var transfer = function (href) {
    var path = removeIfSuffix(href, '/')
      , nextState;

    switch (path) {
    case '/app':
      nextState = {pane: 'menu'};
      hstry.pushState(nextState, 'menu', href);
      return;
    case '/app/config':
      nextState = {pane: 'config'};
      hstry.pushState(nextState, 'config', href);
      return;
    case '/app/relation':
      nextState = {pane: 'relation'};
      hstry.pushState(nextState, 'relation', href);
      return;
    default: //do nothing
    }
    if (path.startsWith('/app/relation/')) {
      nextState = {
        pane: 'relation'
       ,relationNo: path.slice('/app/relation/'.length).split('/')[0]
      };
      hstry.pushState(nextState, 'relation', href);
      return;
    }
  };

  var changeConfig = function (payload) {
    xhr.changeConfig(payload, function (err, res) {
      var data
        , key;
      if (err) {
        return;
      }
      data = res.payload;
      for (key in data) {
        if (data.hasOwnProperty(key)) {
          store.setConfig(key, data[key]);
        }
      }
    });
  };

  var configThumbnail = function (file) {
    xhr.configThumbnail(file, function (err, res) {
      if (err) {
        return;
      }
      store.setConfig('thumbnail', res.payload);
    });
  };

  var configLoginPassword = function (oldPassword, newPassword) {
    var payload = {
      oldPassword: oldPassword
     ,newPassword: newPassword
    };
    xhr.changeConfig(payload, function (err, res) {
      if (err) {
        return;
      }
      alert('passwordを変更しました');
    });
  };

  var makeRelation = function (userid, countersign) {
    xhr.makeRelation(userid, countersign, function (err, res) {
      var data;
      if (err) {
        return;
      }
      data = res.payload;
      store.setRelation([data]);
    });
  };

  var breakRelation = function (userid) {
    xhr.breakRelation(userid, function (err, res) {
      var data;
      if (err) {
        return;
      }
      data = res.payload;
      store.setRelation([data]);
    });
  };

  var wsConn = null;

  var makeWSConnction = function () {
    wsConn = xhr.connectWebSocket(function (data) {
      switch (data.type) {
      case 'RELATION' :
        store.setRelations(data.relations);
      case 'VOICE' :
        store.setVoices(data.userid, data.voices);
      default : //do nothing
      }
    });
  };

  var sendWSMessage = function (payload) {
    wsConn.send(payload);
  };

  var closeWSConnection = function (code, reason) {
    wsConn.close(code, reason);
  };

  var loadRelations = function (offset) {
    var callback = function cbRelations(err, res) {
      var data
        , payload;
      if (err) {
        return;
      }
      data = res;
      payload = data.payload;
      store.setRelations(payload);
      if (data.hasNext) {
        setTimeout(xhr.getRelations(offset + payload.length, relation_request_size, cbRelations), 1000);
      }
    };
    xhr.getRelations(offset, relation_request_size, callback);
  };

  var loadConfig = function () {
    xhr.getConfig(function (err, res){
      if (err) {
        return;
      }
      store.setConfig(res.payload);
    });
  };

  var replaceInitialState = function (href, pathName) {

    var path = removeIfSuffix(pathName, '/')
      , firstLoadedState;

    switch (path) {
    case '/app':
      firstLoadedState = {pane: 'menu'};
      hstry.replaceState(firstLoadedState, 'menu', href);
      return firstLoadedState;
    case '/app/config':
      firstLoadedState = {pane: 'config'};
      hstry.replaceState(firstLoadedState, 'config', href);
      return firstLoadedState;
    case '/app/relation':
      firstLoadedState = {pane: 'relation'};
      hstry.replaceState(firstLoadedState, 'relation', href);
      return firstLoadedState;
    default: //do nothing
    }
    if (path.startsWith('/app/relation/')) {
      firstLoadedState = {
        pane: 'relation'
       ,relationNo: path.slice('/app/relation/'.length).split('/')[0]
      };
      hstry.replaceState(firstLoadedState, 'relation', href);
      return firstLoadedState;
    }
  };

  var domItems = {};

  var change = function (tagName, tagId, opts) {

    var div = doc.createElement('div')
      , tag = doc.createElement('menu')
      , script = doc.createElement('script');

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
    script.src = './tag/' + tagName + '.js';
    div.appendChild(script);
    div.appendChild(tag);
    div.setAttribute('id', tagId);

    mainTag.appendChild(div);
    domItems[tagId] = div;
  };

  var changeState = function (state) {
    switch (state.pane) {

    case 'menu':
      return change('menu', 'menu', {
        schema: store.getRelations()
       ,duties: {transfer: transfer}
      });

    case 'config':
      return change('config', 'config', {
        schema: store.getConfig()
       ,duties: {
          changeConfig: changeConfig
         ,configThumbnail: configThumbnail
         ,configLoginPassword: configLoginPassword
         ,transfer: transfer
        }
      });

    case 'relation':
      var relation = store.getRelation(state.relationNo);

      if (relation && relation.status == 'ACTIVE') {
        return change('chat' + relationNo, 'chat', {
          schema: {
            relation: relation
           ,voices: store.getVoices(relation.userid)
          }
         ,duties: {
            sendMessage: sendWSMessage
           ,breakRelation: breakRelation
           ,transfer: transfer
          }
        });

      } else {
        return change('relate', 'relate', {
          schema: relation
         ,duties: {
            makeRelation: makeRelation
           ,breakRelation: breakRelation
           ,transfer: transfer
          }
        });
      }

    default: //do nothing
    }
  };

  var init = function () {
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

