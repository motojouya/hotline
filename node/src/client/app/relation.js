import serializeColor from '../../lib/colors';
import RelationUtils from '../models/relation';
import VoiceUtils from '../models/voice';
import ConfigUtils from '../models/config';

const makeRelation = (api, transfer, relation, userid, countersign) => {
  RelationUtils.makeRelation(api, userid, countersign, (result) => {
    if (result.make) {
      relation.set(result.relation);
      transfer('/app/');
    } else {
      alert('申請できませんでした');
    }
  });
};

const breakRelation = (api, transfer, relation, relationNo) => {
  RelationUtils.breakRelation(api, relationNo, (result) => {
    if (result.breaks) {
      relation.set(result.relation);
      transfer('/app/');
    } else {
      alert('削除できませんでした');
    }
  });
};

const transfer = (cancelations, route, path) => {
  cancelations.forEach(cancel => cancel());
  route(path);
};

export default (frame, api, ws, riot, route, phone) => {

  const buildRelate = (relation, parentNodeName, transfer) => {
    frame.load(parentNodeName, 'relate', () => {
      riot.mount('section#' + parentNodeName + ' > relate', 'relate', {
        schema: relation,
        duties: {
          transfer: transfer,
          makeRelation: makeRelation.bind(null, api, transfer, relation),
          breakRelation: breakRelation.bind(null, api, transfer, relation),
        },
      });
      frame.pause(false);
    });
  };

  const display = (relationNo) => {

    const relation = RelationUtils.getRelationObj(riot.observable),
          voices = VoiceUtils.getVoicesObj(riot.observable),
          config = ConfigUtils.getConfigObj(riot.observable),
          cancelWsRelation = RelationUtils.listenWebSocket(relation, relationNo, ws),
          cancelWsVoice = VoiceUtils.listenWebSocket(voices, relationNo, ws),
          close = transfer.bind(null, [cancelWsRelation, cancelWsVoice], route);

    frame.pause(true);
    frame.clear();

    RelationUtils.getRelation(api, relationNo, (result) => {
      relation.set(result);

      if (relation.status !== 'ACTIVE') {
        buildRelate(relation, 'relate' + relationNo, close);

      } else {
        Promise.all([
          new Promise(frame.load.bind(frame, 'chat' + relationNo, 'chat')),
          new Promise(VoiceUtils.loadVoices.bind(null, api, voices, relationNo, 0, 20)), //TODO スクロールした場合にvoiceを再取得
          new Promise(ConfigUtils.loadConfig.bind(null, api, config)),
        ]).then(() => {
          riot.mount('section#chat' + relationNo + ' > chat', 'chat', {
            phone: phone,
            schema: {
              relation: relation,
              voices: voices,
              config: config,
            },
            duties: {
              transfer: close,
              serializeColor: serializeColor,
              getSrc: frame.getSrc,
              sendMessage: VoiceUtils.sendMessage.bind(null, ws, relation, voices, config),
              breakRelation: breakRelation.bind(null, api, close, relation),
            },
          });
          frame.pause(false);
        });
      }

    });
  }

  route('app/relation/*', display);
  route('app/relation', (relationNo) => {
    frame.pause(true);
    frame.clear();
    buildRelate(RelationUtils.getRelationObj(riot.observable), 'relate_new', route);
  });
  phone.onStateChange('RECEIVING', 'receiveRoot', display);
};

