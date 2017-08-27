"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (observable) {

  var relations = {};
  var config = {};
  var chats = {};

  observable(relations);
  observable(config);
  observable(chats);

  var getRelations = function getRelations() {
    return relations;
  };

  var setRelations = function setRelations(ary) {
    var i = 0,
        len = ary.length,
        relation,
        key;
    for (; i < len; i++) {
      relation = relations.get(ary[i].userid) || new Relation(ary[i]);
      for (key in ary[i]) {
        if (ary[i].hasOwnProperty(key)) {
          relation.set(key, ary[i][key]);
        }
      }
    }
  };

  var getConfig = function getConfig() {
    return config;
  };

  var setConfig = function setConfig(name, obj) {
    var key;
    if (!obj) {
      obj = name;
      config.set(name, obj);
    } else {
      for (key in obj) {
        if (obj.hasOwnProperty(key)) {
          config.set(key, obj[key]);
        }
      }
    }
  };

  var getVoices = function getVoices(userid) {
    chats[userid] = chats[userid] || new VoiceCollection();
    return chats[userid];
  };

  var setVoices = function setVoices(userid, ary) {
    var voices = chats[userid] || new VoiceCollection(),
        i = 0,
        len = ary.length;
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
    setVoices: setVoices
  };
};