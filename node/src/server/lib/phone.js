
module.export = function (wss) {

  wss.onReceive('ICE', 'ice_from_phone', function (userInfo, relation, contents, conn) {
    conn.done();
    wss.sendMessage(relation.userid, {type: 'ICE', contents: contents}, conn);
  });

  wss.onReceive('CALL', 'call_phone', function (userInfo, relation, contents, conn) {
    conn.done();
    wss.sendMessage(relation.userid, {type: 'ICE', contents: contents}, conn);
  });

  wss.onReceive('HUNGUP', 'hungup_phone', function (userInfo, relation, contents, conn) {
    conn.done();
    wss.sendMessage(relation.userid, {type: 'ICE', contents: contents}, conn);
  });
};

