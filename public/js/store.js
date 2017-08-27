'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setVoices = exports.getVoices = exports.setConfig = exports.getConfig = exports.setRelations = exports.getRelations = undefined;

var _backbone = require('backbone');

var _backbone2 = _interopRequireDefault(_backbone);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Relation = _backbone2.default.Model.extend();
var RelationMap = _backbone2.default.Model.extend();
var relations = new RelationMap();

var Config = _backbone2.default.Model.extend();
var config = new Config();

var Voice = _backbone2.default.Model.extend();
var VoiceCollection = _backbone2.default.Collection.extend();
var chats = {};

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

exports.getRelations = getRelations;
exports.setRelations = setRelations;
exports.getConfig = getConfig;
exports.setConfig = setConfig;
exports.getVoices = getVoices;
exports.setVoices = setVoices;