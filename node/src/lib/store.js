export default function (observable) {

  var relations = {};
  var config = {};
  var chats = {};
  
  observable(relations);
  observable(config);
  observable(chats);
  
  var getRelations = function () {
    return relations;
  };
  
  var setRelations = function (ary) {
    var i = 0
      , len = ary.length
      , relation
      , key
      , obj;
    for (; i < len; i++) {
      obj = ary[i];
      relation = relations[obj.userid] || {};
      for (key in obj) {
        if (obj.hasOwnProperty(key)) {
          relation[key] = obj[key];
        }
      }
      relations[obj.userid] = relation;
    }
  };
  
  var getConfig = function () {
    return config;
  };
  
  var setConfig = function (name, obj) {
    var key;
    if (!obj) {
      obj = name;
      config[name] = obj;
    } else {
      for (key in obj) {
        if (obj.hasOwnProperty(key)) {
          config[key] = obj[key];
        }
      }
    }
  };
  
  var getVoices = function (userid) {
    chats[userid] = chats[userid] || new VoiceCollection();
    return chats[userid];
  };
  
  var setVoices = function (userid, ary) {
    var voices = chats[userid] || new VoiceCollection()
      , i = 0
      , len = ary.length;
    for (; i < len; i++) {
      voices.add(ary[i]);
    }
    return chats[userid] = voices;
  };
  
  return {
    getRelations: getRelations,
    setRelations: setRelations,
    getConfig: getConfig,
    setConfig: setConfig,
    getVoices: getVoices,
    setVoices: setVoices,
  };
}


