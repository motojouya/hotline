import serializeColor from '../../lib/colors';

var getChangeConfigs = function (configs, api) {

  var changeConfig = function (payload) {
    var key,
        before = {};
    for (key in configs) {
       if (configs.hasOwnProperty(key) && 'function' !== typeof configs[key]) {
         before[key] = configs[key];
       }
    }
    configs.set(payload);

    api.changeConfig(payload, function (result) {
      if (!result.change) {
        configs.set(before);
      } else {
        configs.set(result);
      }
    });
  };

  var changeThumbnail = function (file) {
    api.changeThumbnail(file, function (result) {
      if (result.change) {
        alert('thumbnailを変更しました');
      } else {
        alert('thumbnailを変更しました');
      }
    });
  };

  var changePassword = function (nowPassword, newPassword) {
    var payload = {
      now_password: nowPassword
     ,new_password: newPassword
    };
    api.changePassword(payload, function (result) {
      if (result.change) {
        alert('passwordを変更しました');
      } else {
        alert('passwordの変更に失敗しました');
      }
    });
  };

  return {
    changeConfig: changeConfig,
    changeThumbnail: changeThumbnail,
    changePassword: changePassword,
  };
};

var getConfigObj = function (observe) {
  var configs = {};
  observe(configs);

  configs.set = function (result) {
    var key;
    for (key in result) {
      if (result.hasOwnProperty(key) && 'function' !== typeof result[key]) {
        configs[key] = result[key];
      }
    }
    configs.trigger('change');
  };
  return configs;
};

var connect = function (configs, ws, route) {
  ws.onReceive('CONFIG', 'config', function (payload) {
    configs.set(payload);
  });
  return function (path) {
    ws.cancelListener('CONFIG', 'config');
    route(path);
  };
};

export default function (frame, api, ws, riot, route) {
  route('app/config', function () {

    var configs = getConfigObj(riot.observable),
        transfer = connect(configs, ws, route),
        configLoaded = false,
        domLoaded = false;

    var build = function () {
      riot.mount('section#config > config', 'config', {
        schema: configs,
        duties: {
          transfer: transfer,
          serializeColor: serializeColor,
          changer: getChangeConfigs(configs, api),
        }
      });
      frame.pause(false);
    };

    frame.pause(true);
    frame.clear();

    frame.load('config', 'config', function () {
      if (configLoaded) {
        build();
      }
      domLoaded = true;
    });
    api.getConfig(function (result){
      configs.set(result);
      if (domLoaded) {
        build();
      }
      configLoaded = true;
    });

  });
};

