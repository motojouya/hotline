import serializeColor from '../../lib/colors';
import Config from '../models/config';

export default (frame, api, ws, riot, route) => {
  route('app/config', () => {

    const configs = Config.getConfigObj(riot.observable),
          cancelWebSocket = Config.listenWebSocket(configs, ws, route);

    frame.pause(true);
    frame.clear();

    Promise.all([
      new Promise(frame.load.bind(frame, 'config', 'config')),
      new Promise(Config.loadConfig.bind(null, api, configs)),
    ]).then(() => {
      riot.mount('section#config > config', 'config', {
        schema: configs,
        duties: {
          serializeColor: serializeColor,
          transfer: (path) => {
            cancelWebSocket();
            route(path);
          },
          changer: {
            changeConfig: Config.changeConfig.bind(null, configs, api),
            changeThumbnail: Config.changeConfig.bind(null, configs, api),
            changePassword: Config.changeConfig.bind(null, configs, api),
          },
        }
      });
      frame.pause(false);
    });

  });
};

