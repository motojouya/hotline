export default function (observable) {

  var relations = {};
  var config = {};
  var chats = {};
  
  observable(relations);
  observable(config);
  
  var getRelations = function () {
    return relations;
  };
  
  var getRelation = function (relation_no) {
    return relations[relation_no];
  };
  
  var setRelations = function (ary) {
    var i = 0,
        len = ary.length,
        relation,
        key,
        obj;
    for (; i < len; i++) {
      obj = ary[i];
      if (relations[obj.relation_no]) {
        relation = relations[obj.relation_no];
      } else {
        relation = {};
        observable(relation);
      }

      for (key in obj) {
        if (obj.hasOwnProperty(key)) {
          relation[key] = obj[key];
        }
      }
      relations[obj.relation_no] = relation;
    }
  };
  
  var getConfig = function () {
    return config;
  };
  
  var setConfig = function (name, obj) {
    var key;
    if (obj) {
      config[name] = obj;
      return;
    }
    obj = name;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        config[key] = obj[key];
      }
    }
  };
  
  var getVoices = function (relation_no) {
    var voices;
    if (chats[relation_no]) {
      voices = chats[relation_no];
    } else {
      voices = [];
      observable(voices);
    }
    return voices;
  };
  
  var setVoices = function (relation_no, ary) {
    var voices,
        i = 0,
        len = ary.length;

    if (chats[relation_no]) {
      voices = chats[relation_no];
    } else {
      voices = [];
      observable(voices);
    }

    for (; i < len; i++) {
      voices.add(ary[i]);
    }
    return chats[relation_no] = voices;
  };
  
  return {
    getRelations: getRelations,
    getRelation: getRelation,
    setRelations: setRelations,
    getConfig: getConfig,
    setConfig: setConfig,
    getVoices: getVoices,
    setVoices: setVoices,
  };
}

