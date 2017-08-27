"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _superagent = require("superagent");

var _superagent2 = _interopRequireDefault(_superagent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var links = [{ no: 1, apply: "hamada", accept: "matsumoto", status: 1, clap: "2017-07-02 10:10:10", message: "2017-07-01 12:34:56", call: "2017-06-17 11:21:45" }, { no: 2, apply: "matsumoto", accept: "hamada", status: 1, clap: "2017-04-09 23:12:11", message: "2017-04-09 23:12:21", call: null }];

var voices = [{ no: 1, speak_at: "2017-07-01 12:34:56", userid: "hamada", message: "今日の夕飯なにかな？", meta_flag: null, file_no: null, tel_flag: null }, { no: 1, speak_at: "2017-07-01 12:34:57", userid: "matsumoto", message: "んー", meta_flag: null, file_no: null, tel_flag: null }, { no: 1, speak_at: "2017-07-01 12:34:58", userid: "hamada", message: "カレーかな？", meta_flag: null, file_no: null, tel_flag: null }, { no: 1, speak_at: "2017-07-01 12:34:59", userid: "matsumoto", message: "まだ考えてない。。。", meta_flag: null, file_no: null, tel_flag: null }, { no: 1, speak_at: "2017-07-01 12:34:00", userid: "hamada", message: "そっか", meta_flag: null, file_no: null, tel_flag: null }, { no: 1, speak_at: "2017-07-01 12:35:10", userid: "hamada", message: "それならさ", meta_flag: null, file_no: null, tel_flag: null }, { no: 1, speak_at: "2017-07-01 12:35:11", userid: "hamada", message: "そとで食べようよ", meta_flag: null, file_no: null, tel_flag: null }, { no: 1, speak_at: "2017-07-01 12:35:12", userid: "hamada", message: "カレーでもいいし", meta_flag: null, file_no: null, tel_flag: null }, { no: 1, speak_at: "2017-07-01 12:35:16", userid: "matsumoto", message: "ホント？", meta_flag: null, file_no: null, tel_flag: null }, { no: 1, speak_at: "2017-07-01 12:35:17", userid: "matsumoto", message: "助かる", meta_flag: null, file_no: null, tel_flag: null }, { no: 1, speak_at: "2017-07-01 12:35:18", userid: "hamada", message: "うん", meta_flag: null, file_no: null, tel_flag: null }, { no: 1, speak_at: "2017-07-01 12:35:22", userid: "hamada", message: "いつもご飯作ってくれてるから", meta_flag: null, file_no: null, tel_flag: null }, { no: 1, speak_at: "2017-07-01 12:35:23", userid: "hamada", message: "今日はいいんだよ", meta_flag: null, file_no: null, tel_flag: null }, { no: 1, speak_at: "2017-07-01 12:35:25", userid: "matsumoto", message: "ありがとう", meta_flag: null, file_no: null, tel_flag: null }, { no: 1, speak_at: "2017-07-01 12:35:27", userid: "hamada", message: "どういたしまして", meta_flag: null, file_no: null, tel_flag: null }, { no: 1, speak_at: "2017-07-02 10:10:10", userid: "hamada", message: "", meta_flag: null, file_no: null, tel_flag: null }];

var connectWebSocket = function connectWebSocket(callback, recover) {
  var wsSend = function wsSend(message) {
    callback(message);
  };
  var wsClose = function wsClose(code, reason) {
    console.log('just closed.' + code + 'data' + reason);
  };
  return {
    send: wsSend,
    close: wsClose
  };
};

var makeRelation = function makeRelation(userid, countersign, callback) {
  if (userid === 'yamada' && countersign === 'america') {
    callback(null, { isSuccess: true, message: 'ツナガルリクエストを送信しました', userid: userid });
  } else {
    callback(null, { isSuccess: false, message: '拒否されました', userid: userid });
  }
};

var breakRelation = function breakRelation(userid, callback) {
  callback(null, { isSuccess: true, message: '関係を解消しました', userid: userid });
};

var getRelations = function getRelations(offset, limit, callback) {
  callback(null, { isSuccess: true, message: '', result: links });
};

var getVoices = function getVoices(userid, offset, limit, callback) {
  callback(null, { isSuccess: true, message: '', result: voices });
};

var getConfig = function getConfig(callback) {
  callback(null, {
    userid: 'userid',
    name: '',
    email: 'test@gmail.com',
    countersign: 'peru',
    colorNumber: 4,
    thumbnail: '',
    notification: 0
  });
};

var changeConfig = function changeConfig(payload, callback) {
  callback(null, { isSuccess: true, payload: payload });
};

var configThumbnail = function configThumbnail(file, callback) {
  callback(null, { isSuccess: true, file: file, message: 'サムネイル画像を変更しました' });
};

exports.default = {
  connectWebSocket: connectWebSocket,
  getRelations: getRelations,
  makeRelation: makeRelation,
  breakRelation: breakRelation,
  getVoices: getVoices,
  getConfig: getConfig,
  changeConfig: changeConfig,
  configThumbnail: configThumbnail
};