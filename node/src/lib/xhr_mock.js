import agent from 'superagent';

var relations = [
  {relation_no: 1, userid: "hamada", name: "浜田", is_applicant: true, colorNumber: "313", status: "ACTIVE", thumbnail: "/app/img/test.jpg", message: "2017-07-01 12:34:56", call: "2017-06-17 11:21:45"}
 ,{relation_no: 2, userid: "takasu", name: "高須", is_applicant: false, colorNumber: "291", status: "PENDING", thumbnail: "/app/img/test.jpg", message: "2017-04-09 23:12:21", call: null}
];

var voices = [
  {no: 1, speak_at: "2017-07-02 10:10:10", userid: "hamada", message: "", meta_flag: null, file_no: null, tel_flag: null},
  {no: 1, speak_at: "2017-07-01 12:35:27", userid: "hamada", message: "どういたしまして", meta_flag: null, file_no: null, tel_flag: null},
  {no: 1, speak_at: "2017-07-01 12:35:25", userid: "matsumoto", message: "ありがとう", meta_flag: null, file_no: null, tel_flag: null},
  {no: 1, speak_at: "2017-07-01 12:35:23", userid: "hamada", message: "今日はいいんだよ", meta_flag: null, file_no: null, tel_flag: null},
  {no: 1, speak_at: "2017-07-01 12:35:22", userid: "hamada", message: "いつもご飯作ってくれてるから", meta_flag: null, file_no: null, tel_flag: null},
  {no: 1, speak_at: "2017-07-01 12:35:18", userid: "hamada", message: "うん", meta_flag: null, file_no: null, tel_flag: null},
  {no: 1, speak_at: "2017-07-01 12:35:17", userid: "matsumoto", message: "助かる", meta_flag: null, file_no: null, tel_flag: null},
  {no: 1, speak_at: "2017-07-01 12:35:16", userid: "matsumoto", message: "ホント？", meta_flag: null, file_no: null, tel_flag: null},
  {no: 1, speak_at: "2017-07-01 12:35:12", userid: "hamada", message: "カレーでもいいし", meta_flag: null, file_no: null, tel_flag: null},
  {no: 1, speak_at: "2017-07-01 12:35:11", userid: "hamada", message: "そとで食べようよ", meta_flag: null, file_no: null, tel_flag: null},
  {no: 1, speak_at: "2017-07-01 12:35:10", userid: "hamada", message: "それならさ", meta_flag: null, file_no: null, tel_flag: null},
  {no: 1, speak_at: "2017-07-01 12:34:00", userid: "hamada", message: "そっか", meta_flag: null, file_no: null, tel_flag: null},
  {no: 1, speak_at: "2017-07-01 12:34:59", userid: "matsumoto", message: "まだ考えてない。。。", meta_flag: null, file_no: null, tel_flag: null},
  {no: 1, speak_at: "2017-07-01 12:34:58", userid: "hamada", message: "カレーかな？", meta_flag: null, file_no: null, tel_flag: null},
  {no: 1, speak_at: "2017-07-01 12:34:57", userid: "matsumoto", message: "んー", meta_flag: null, file_no: null, tel_flag: null},
  {no: 1, speak_at: "2017-07-01 12:34:56", userid: "hamada", message: "今日の夕飯なにかな？", meta_flag: null, file_no: null, tel_flag: null},
];

export default function (whenErr) {

  var listeners = {};

  var sendMessage = function (type, userid, payload) {
    voices.unshift({
      no: payload.relationNo,
      speak_at: "2017-07-02 10:10:10",
      userid: "matsumoto",
      message: payload.message,
      meta_flag: null,
      file_no: null,
      tel_flag: null
    });
  };

  var connectWebSocket = function (onFirst) {
    onFirst();
  };

  var closeWS = function (code, reason) {};

  var onReceive = function (type, key, func) {
    if (!listeners[type]) {
      listeners[type] = {};
    }
    listeners[type][key] = func;
  };

  var cancelListener = function (type, key) {
    if (listeners[type]) {
      listeners[type][key] = null;
    }
  };

  var makeRelation = function (userid, countersign, callback) {
    if (userid === 'yamada' && countersign === 'america') {
      callback({result: true, payload: relations[0]});
    } else {
      callback({result: false, payload: relations[0]});
    }
  };
  
  var breakRelation = function (userid, callback) {
    callback({result: true, payload: relations[0]});
  };
  
  var getRelation = function (relationNo, callback) {
    var i = 0,
        len = relations.length;
    for (; i < len; i++) {
      if (relationNo == relations[i].relation_no) {
        callback(relations[i]);
        return;
      }
    }
    callback();
  };
  
  var getRelations = function (offset, limit, callback) {
    callback({hasNext: false, payload: relations});
  };
  
  var getVoices = function (userid, offset, limit, callback) {
    callback({hasNext: false, payload: voices});
  };
  
  var getConfig = function (callback) {
    callback({
      userid: 'matsumoto',
      name: '松本 人志',
      email: 'test@gmail.com',
      countersign: 'peru',
      colorNumber: 4,
      thumbnail: '/app/img/test.jpg',
      notification: 0,
    });
  };
  
  var changeConfig = function (payload, callback) {
    callback({result: true, payload: payload});
  };
  
  var configThumbnail = function (file, callback) {
    callback({result: true, payload: file});
  };
  
  var loadRelations = function (offset, setRelations) {
    getRelations(0, 0, setRelations);
  };
  
  var getQueryDictionary = function (query) {
  
    if (!query) {
      return;
    }
    var paramEntry = query.slice(1).split('&')
      , i = 0
      , len = paramEntry.length
      , queryDic = {}
      , queryItem;
  
    for (;i < len; i++) {
      queryItem = paramEntry[i].split('=');
      queryDic[queryItem[0]] = queryItem[1];
    }
    return queryDic;
  };
  
  var login = function (userid, password, onetimePassword, callback) {
    callback(true);
  };
  
  return {
    connectWebSocket: connectWebSocket,
    getRelation: getRelation,
    makeRelation: makeRelation,
    breakRelation: breakRelation,
    getVoices: getVoices,
    getConfig: getConfig,
    changeConfig: changeConfig,
    configThumbnail: configThumbnail,
    loadRelations: loadRelations,
    getQueryDictionary: getQueryDictionary,
    login: login,
    sendMessage: sendMessage,
    closeWS: closeWS,
    onReceive: onReceive,
    cancelListener: cancelListener,
  };
};
