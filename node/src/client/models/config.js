'use strict';

const DDL = {
  name: 'config',
  option: {keyPath:'userid'},
};

const listenWebSocket = (configs, ws, route) => {
  ws.onReceive('CONFIG', 'config', function (payload) {
    configs.set(payload);
  });
  return (path) => {
    ws.cancelListener('CONFIG', 'config');
  };
};

const getConfigObj = (observe) => {
  const configs = {};
  observe(configs);

  configs.set = (result) => {
    for (let key in result) {
      if (result.hasOwnProperty(key) && 'function' !== typeof result[key]) {
        configs[key] = result[key];
      }
    }
    configs.trigger('change');
  };
  return configs;
};

const getConfig = (api, callback) => {
  api.get('/api/v1/config', callback);
};

const loadConfig = (api, configs, done) => {
  getConfig(api, (result) => {
    configs.set(result);
    done();
  });
};

const changeConfig = (configs, api, payload) => {
  const before = {};
  for (let key in configs) {
     if (configs.hasOwnProperty(key) && 'function' !== typeof configs[key]) {
       before[key] = configs[key];
     }
  }
  configs.set(payload);

  api.put('/api/v1/config', payload, (result) => {
    if (!result.change) {
      configs.set(before);
    } else {
      configs.set(result);
    }
  });
};

const changeThumbnail = (api, file) => {
  api.put('/api/v1/config/thumbnail', file, (result) => {
    if (result.change) {
      alert('thumbnailを変更しました');
    } else {
      alert('thumbnailを変更しました');
    }
  });
};

const changePassword = (api, nowPassword, newPassword) => {
  api.put('/api/v1/config/password', {
    now_password: nowPassword,
    new_password: newPassword
  }, (result) => {
    if (result.change) {
      alert('passwordを変更しました');
    } else {
      alert('passwordの変更に失敗しました');
    }
  });
};

const fetchConfig = (db, transmitter, request) => {
  const storeName = DDL.name;
  return transmitter.fetch(request)
    .then((response) => {
      if (response.ok) {
        return response.clone().body.getReader().read().then((body) => {
          db.put(storeName, JSON.parse(new TextDecoder().decode(body.value)), console.log.bind(console, 'TODO'));
          return new transmitter.Response(body.value, {
            statue: response.status,
            statusText: response.statusText,
            headers: response.headers
          });
        });
      } else {
        return new Promise((resolve) => {
          db.get(storeName, null, resolve);
        }).then((result) => {
          return new transmitter.Response(JSON.stringify(result));
        });
      }
    });
};

export default {
  DDL,
  getConfigObj,
  getConfig,
  loadConfig,
  changeConfig,
  changeThumbnail,
  changePassword,
  listenWebSocket,
  fetchConfig,
};

