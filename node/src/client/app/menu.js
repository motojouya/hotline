import RelationDictionary from '../models/relationDictionary';

export default (frame, api, ws, riot, route) => {
  route('app', () => {

    const relationDic = RelationDictionary.getRelationsObj(riot.observable),
          cancelWebSocket = RelationDictionary.listenWebSocket(relationDic, ws);

    frame.pause(true);
    frame.clear();

    Promise.all([
      new Promise(frame.load.bind(frame, 'menu', 'menu')),
      new Promise(RelationDictionary.loadRelations.bind(null, api, relationDic, 0)),
    ]).then(() => {
      riot.mount('section#menu > menu', 'menu', {
        schema: relationDic,
        duties: {
          transfer: (path) => {
            cancelWebSocket();
            route(path);
          }
        }
      });
      frame.pause(false);
    });

  });
};

