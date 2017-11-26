import serializeColor from '../lib/colors';

var getChangeConfigs = function (configs, api) {

  var changeConfig = function (payload) {
    var requestKey,
        before = {};
    for (requestKey in payload) {
      if (payload.hasOwnProperty(requestKey)) {
        before[requestKey] = configs[requestKey];
        configs[requestKey] = payload[requestKey];
      }
    }
    api.changeConfig(payload, function (isSuccess) {
      var key;
      if (!isSuccess) {
        for (key in before) {
          if (before.hasOwnProperty(key)) {
            config[key] = before[key];
          }
        }
        configs.trigger('back');
      }
    });
  };
  
  var configThumbnail = function (file) {
    api.configThumbnail(file, function (isSuccess) {
      if (isSuccess) {
        alert('thumbnailを変更しました');
      } else {
        alert('thumbnailを変更しました');
      }
    });
  };
  
  var configLoginPassword = function (oldPassword, newPassword) {
    var payload = {
      oldPassword: oldPassword
     ,newPassword: newPassword
    };
    api.changeConfig(payload, function (isSuccess) {
      if (isSuccess) {
        alert('passwordを変更しました');
      } else {
        alert('passwordの変更に失敗しました');
      }
    });
  };

  return {
    changeConfig: changeConfig,
    configThumbnail: configThumbnail,
    configLoginPassword: configLoginPassword,
  };
};

var getConfigObj = function (observe) {
  var configs = {};
  observe(configs);

  configs.set = function (result) {
    var key;
    for (key in result) {
      if (result.hasOwnProperty(key)) {
        configs[key] = result[key];
      }
    }
  };
  return configs;
};

var connect = function (configs, api, route) {
  api.onReceive('CONFIG', 'config', function (payload) {
    configs.set(payload);
  });
  return function (path) {
    api.cancelListener('CONFIG', 'config');
    route(path);
  };
};

export default function (frame, api, riot, route) {
  route('/app/config', function () {

    var configs = getConfigObj(riot.observable),
        transfer = connect(configs, api, route),
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

