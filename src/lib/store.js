import Backbone from 'backbone'

var Relation = Backbone.Model.extend();
var RelationMap = Backbone.Model.extend();
var relations = new RelationMap();

var Config = Backbone.Model.extend();
var config = new Config();

var Voice = Backbone.Model.extend();
var VoiceCollection = Backbone.Collection.extend();
var chats = {};

var getRelations = function () {
  return relations;
};

var setRelations = function (ary) {
  var i = 0
    , len = ary.length
    , relation
    , key;
  for (; i < len; i++) {
    relation = relations.get(ary[i].userid) || new Relation(ary[i]);
    for (key in ary[i]) {
      if (ary[i].hasOwnProperty(key)) {
        relation.set(key, ary[i][key])
      }
    }
  }
};

var getConfig = function () {
  return config;
};

var setConfig = function (name, obj) {
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

export {
  getRelations
 ,setRelations
 ,getConfig
 ,setConfig
 ,getVoices
 ,setVoices
};

