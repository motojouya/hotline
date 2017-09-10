import agent from 'superagent';

var relations = [
  {no: 1, userid: "hamada", name: "浜田", apply: "hamada", accept: "matsumoto", status: "ACTIVE", clap: "2017-07-02 10:10:10", message: "2017-07-01 12:34:56", call: "2017-06-17 11:21:45"}
 ,{no: 2, userid: "takasu", name: "高須", apply: "matsumoto", accept: "takasu", status: "ACTIVE", clap: "2017-04-09 23:12:11", message: "2017-04-09 23:12:21", call: null}
];

var voices = [
  {no: 1, speak_at: "2017-07-01 12:34:56", userid: "hamada", message: "今日の夕飯なにかな？", meta_flag: null, file_no: null, tel_flag: null}
 ,{no: 1, speak_at: "2017-07-01 12:34:57", userid: "matsumoto", message: "んー", meta_flag: null, file_no: null, tel_flag: null}
 ,{no: 1, speak_at: "2017-07-01 12:34:58", userid: "hamada", message: "カレーかな？", meta_flag: null, file_no: null, tel_flag: null}
 ,{no: 1, speak_at: "2017-07-01 12:34:59", userid: "matsumoto", message: "まだ考えてない。。。", meta_flag: null, file_no: null, tel_flag: null}
 ,{no: 1, speak_at: "2017-07-01 12:34:00", userid: "hamada", message: "そっか", meta_flag: null, file_no: null, tel_flag: null}
 ,{no: 1, speak_at: "2017-07-01 12:35:10", userid: "hamada", message: "それならさ", meta_flag: null, file_no: null, tel_flag: null}
 ,{no: 1, speak_at: "2017-07-01 12:35:11", userid: "hamada", message: "そとで食べようよ", meta_flag: null, file_no: null, tel_flag: null}
 ,{no: 1, speak_at: "2017-07-01 12:35:12", userid: "hamada", message: "カレーでもいいし", meta_flag: null, file_no: null, tel_flag: null}
 ,{no: 1, speak_at: "2017-07-01 12:35:16", userid: "matsumoto", message: "ホント？", meta_flag: null, file_no: null, tel_flag: null}
 ,{no: 1, speak_at: "2017-07-01 12:35:17", userid: "matsumoto", message: "助かる", meta_flag: null, file_no: null, tel_flag: null}
 ,{no: 1, speak_at: "2017-07-01 12:35:18", userid: "hamada", message: "うん", meta_flag: null, file_no: null, tel_flag: null}
 ,{no: 1, speak_at: "2017-07-01 12:35:22", userid: "hamada", message: "いつもご飯作ってくれてるから", meta_flag: null, file_no: null, tel_flag: null}
 ,{no: 1, speak_at: "2017-07-01 12:35:23", userid: "hamada", message: "今日はいいんだよ", meta_flag: null, file_no: null, tel_flag: null}
 ,{no: 1, speak_at: "2017-07-01 12:35:25", userid: "matsumoto", message: "ありがとう", meta_flag: null, file_no: null, tel_flag: null}
 ,{no: 1, speak_at: "2017-07-01 12:35:27", userid: "hamada", message: "どういたしまして", meta_flag: null, file_no: null, tel_flag: null}
 ,{no: 1, speak_at: "2017-07-02 10:10:10", userid: "hamada", message: "", meta_flag: null, file_no: null, tel_flag: null}
];

var connectWebSocket = function (callback, recover) {
  var wsSend = function (message) {
    callback(message);
  };
  var wsClose = function (code, reason) {
    console.log('just closed.' + code + 'data' + reason);
  };
  return {
    send: wsSend,
    close: wsClose,
  };
};

var makeRelation = function (userid, countersign, callback) {
  if (userid === 'yamada' && countersign === 'america') {
    callback(null, {result: true, payload: relations[0]});
  } else {
    callback(null, {result: false, payload: relations[0]});
  }
};

var breakRelation = function (userid, callback) {
  callback(null, {result: true, payload: relations[0]});
};

var getRelations = function (offset, limit, callback) {
  callback(null, {hasNext: false, payload: relations});
};

var getVoices = function (userid, offset, limit, callback) {
  callback(null, {hasNext: false, payload: voices});
};

var getConfig = function (callback) {
  callback(null, {
    result: true,
    payload: {
      userid: 'userid',
      name: '',
      email: 'test@gmail.com',
      countersign: 'peru',
      colorNumber: 4,
      thumbnail: '',
      notification: 0,
    }
  });
};

var changeConfig = function (payload, callback) {
  callback(null, {result: true, payload: payload});
};

var configThumbnail = function (file, callback) {
  callback(null, {result: true, payload: file});
};

export default {
  connectWebSocket
 ,getRelations
 ,makeRelation
 ,breakRelation
 ,getVoices
 ,getConfig
 ,changeConfig
 ,configThumbnail
};

