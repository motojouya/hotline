'use strict';

var validation = require('../../lib/validation');

const INSERT_RELATION = 'INSERT INTO relations (status) VALUES (\'PENDING\')';
const INSERT_RELATION_USER = 'INSERT INTO relation_user (relation_no, userid, is_applicant) VALUES (currval(\'relations_relation_no_seq\'), $1, $2), (currval(\'relations_relation_no_seq\'), $3, $4)';
const UPDATE_RELATION = 'UPDATE relations SET status = $1 WHERE relation_no = $2';
const SELECT_USER = 'SELECT userid, name, color, thumbnail FROM users WHERE userid = $1 AND countersign = $2 AND active = TRUE';
const INSERT_VOICE = 'INSERT INTO voices (relation_no, userid, sentence) VALUES ($1, $2, $3)';

const SELECT_RELATION
  = 'SELECT users.userid AS userid'
  + '     , users.name AS name'
  + '     , users.color AS color'
  + '     , users.thumbnail AS thumbnail'
  + '     , self.is_applicant AS is_applicant'
  + '     , relations.status AS status'
  + '     , relations.relation_no AS relation_no'
  + '  FROM relation_user AS self'
  + ' INNER JOIN relations AS relations'
  + '    ON self.relation_no = relations.relation_no'
  + '   AND self.userid = $1'
  + '   AND relations.status IN (\'PENDING\', \'ACTIVE\')'
  + ' INNER JOIN relation_user AS other'
  + '    ON relations.relation_no = other.relation_no'
  + '   AND other.userid <> $2'
  + ' INNER JOIN users AS users'
  + '    ON other.userid = users.userid'
  + '   AND users.active = TRUE';

const SELECT_BROKEN_RELATION
  = 'SELECT users.userid AS userid'
  + '     , users.name AS name'
  + '     , users.color AS color'
  + '     , users.thumbnail AS thumbnail'
  + '     , self.is_applicant AS is_applicant'
  + '     , relations.status AS status'
  + '     , relations.relation_no AS relation_no'
  + '  FROM relation_user AS self'
  + ' INNER JOIN relations AS relations'
  + '    ON self.relation_no = relations.relation_no'
  + '   AND self.userid = $1'
  + '   AND relations.status = \'BROKEN\''
  + ' INNER JOIN relation_user AS other'
  + '    ON relations.relation_no = other.relation_no'
  + '   AND other.userid <> $2'
  + ' INNER JOIN users AS users'
  + '    ON other.userid = users.userid'
  + '   AND users.active = TRUE';

const SELECT_VOICE
  = 'SELECT voices.spoken_at'
  + '     , voices.userid'
  + '     , voices.sentence'
  + '  FROM relations AS relations'
  + ' INNER JOIN voices AS voices'
  + '    ON relations.relation_no = voices.relation_no'
  + '   AND relations.status = \'ACTIVE\''
  + '   AND relations.relation_no = $1'
  + ' ORDER BY voices.spoken_at DESC'
  + ' OFFSET $2 LIMIT $3';

const getRelation = (req, res) => {
  var conn = req.connection,
      userInfo = req.session.userInfo,
      selfUserid = userInfo.userid,
      relationNo = req.params.relation_no || req.query.relation_no,
      offset = req.query.offset,
      limit = req.query.limit;

  if (relationNo) {
    if (!validation.isNumber(relationNo)) {
      console.error(req.receivedAt, 'GetRelation. illegal parameter relationNo.');
      conn.done();
      return res.json({});
    }
    return conn.client.query(SELECT_RELATION + ' WHERE relations.relation_no = $3', [selfUserid, selfUserid, relationNo], (err, result) => {
      conn.done();
      if (err) {
        console.error(req.receivedAt, 'GetRelation. sql SELECT_RELATION single error.', err);
        conn.done();
        return res.json({});
      }
      var relation = result.rows[0];
      if (!relation) {
        console.error(req.receivedAt, 'GetRelation. no relation.');
        conn.done();
        return res.json({});
      }
      return res.json(relation);
    });

  } else if (offset && limit) {
    if (!validation.isNumber(offset) || !validation.isNumber(limit)) {
      console.error(req.receivedAt, 'GetRelation. illegal parameter offset and limit.');
      conn.done();
      return res.json({hasNext: false, results: []});
    }
    return conn.client.query(SELECT_RELATION + ' ORDER BY users.name OFFSET $3 LIMIT $4', [selfUserid, selfUserid, offset, (limit + 1)], (err, result) => {
      conn.done();
      if (err) {
        console.error(req.receivedAt, 'GetRelation. sql SELECT_RELATION multi error.', err);
        return res.json({hasNext: false, results: []});
      }
      var results = result.rows;
      var hasNext = false;
      if (results.length > limit) {
        hasNext = true;
        results = results.slice(0, limit);
      }
      return res.json({hasNext: hasNext, results: results});
    });

  } else {
    conn.done();
    console.error(req.receivedAt, 'GetRelation. Nothing happened.');
    return res.json({});
  }
};

const rollback = (conn) => {
  conn.client.query('ROLLBACK', (err) => {
    conn.done();
    if (err) {
      console.error(req.receivedAt, 'Rollback. sql ROLLBACK error.', err);
    }
  });
};

const sendRelation = (selfUserid, relation, conn, wss) => {
  conn.client.query(SELECT_RELATION + ' WHERE other.userid = $3', [selfUserid, selfUserid, relation.relation_no], (err, result) => {
    if (err) {
      console.error(req.receivedAt, 'SendRelation. sql SELECT_RELATION error.', err);
      conn.done();
      return;
    }
    var relationOther = result.rows[0];
    wss.sendMessage(relationOther.userid, relationOther, conn);
  });
};

const makeRelation = (req, res) => {
  var conn = req.connection,
      userInfo = req.session.userInfo,
      selfUserid = userInfo.userid,
      otherUserid = req.body.userid,
      countersign = req.body.countersign;

  if (!otherUserid || !validation.isAllASCII(otherUserid)
   || !countersign || !validation.isAllASCII(countersign)) {
    console.error(req.receivedAt, 'MakeRelation. illegal parameters.');
    conn.done();
    return res.json({make: false});
  }

  conn.client.query(SELECT_USER, [otherUserid, countersign], (err, result) => {
    if (err) {
      console.error(req.receivedAt, 'MakeRelation. sql SELECT_USER error.', err);
      conn.done();
      return res.json({make: false});
    }
    var user = result.rows[0];
    if (!user) {
      console.error(req.receivedAt, 'MakeRelation. no user.');
      conn.done();
      return res.json({make: false});
    }

    conn.client.query(SELECT_RELATION + ' WHERE other.userid = $3', [selfUserid, selfUserid, otherUserid], (err, result) => {
      if (err) {
        console.error(req.receivedAt, 'MakeRelation. sql SELECT_RELATION error.', err);
        conn.done();
        return res.json({make: false});
      }
      var relation = result.rows[0];

      if (relation) {
        conn.client.query(UPDATE_RELATION, ['ACTIVE', relation.relation_no], (err, result) => {
          conn.done();
          if (err) {
            console.error(req.receivedAt, 'MakeRelation. sql UPDATE_RELATION error.', err);
            return res.json({make: false});
          }
          conn.client.query(SELECT_RELATION + ' WHERE relations.relation_no = $3', [selfUserid, selfUserid, relation.relation_no], (err, result) => {
            conn.done();
            if (err) {
              console.error(req.receivedAt, 'MakeRelation. sql SELECT_RELATION last error.', err);
              return res.json({make: false});
            }
            var newRelation = result.rows[0];
            if (!newRelation) {
              console.error(req.receivedAt, 'MakeRelation. no newRelation.');
              return res.json({make: false});
            }
            // sendRelation(selfUserid, relation, conn, wss);
            res.json({
              make: true,
              relation: newRelation,
            });
          });
        });

      } else {
        conn.client.query('BEGIN', (err) => {
          if (err) {
            console.error(req.receivedAt, 'MakeRelation. sql BEGIN error.', err);
            rollback(conn);
            return res.json({make: false});
          }
          conn.client.query(INSERT_RELATION, (err, result) => {
            if (err) {
              console.error(req.receivedAt, 'MakeRelation. sql INSERT_RELATION error.', err);
              rollback(conn);
              return res.json({make: false});
            }
            conn.client.query(INSERT_RELATION_USER, [selfUserid, true, otherUserid, false], (err, result) => {
              if (err) {
                console.error(req.receivedAt, 'MakeRelation. sql INSERT_RELATION_USER error.', err);
                rollback(conn);
                return res.json({make: false});
              }
              conn.client.query('COMMIT', (err) => {
                if (err) {
                  console.error(req.receivedAt, 'MakeRelation. sql COMMIT error.', err);
                  conn.done();
                  return res.json({make: false});
                }
                conn.client.query(SELECT_RELATION + ' WHERE relations.relation_no = currval(\'relations_relation_no_seq\')', [selfUserid, selfUserid], (err, result) => {
                  conn.done();
                  if (err) {
                    console.error(req.receivedAt, 'MakeRelation. sql SELECT_RELATION last error.', err);
                    return res.json({make: false});
                  }
                  var newRelation = result.rows[0];
                  if (!newRelation) {
                    console.error(req.receivedAt, 'MakeRelation. no newRelation.');
                    return res.json({make: false});
                  }
                  // sendRelation(selfUserid, relation, conn, wss);
                  res.json({
                    make: true,
                    relation: newRelation,
                  });
                });
              });
            });
          });
        });
      }
    });
  });
};

const breakRelation = (req, res) => {
  var conn = req.connection,
      userInfo = req.session.userInfo,
      selfUserid = userInfo.userid,
      relationNo = req.params.relation_no;

  if (!relationNo || !validation.isNumber(relationNo)) {
    console.error(req.receivedAt, 'BreakRelation. illegal parameters.');
    conn.done();
    return res.json({breaks: false});
  }

  conn.client.query(UPDATE_RELATION, ['BROKEN', relationNo], (err, result) => {
    if (err || result.rowCount != 1) {
      console.error(req.receivedAt, 'BreakRelation. sql UPDATE_RELATION error.', err || result.rowCount);
      conn.done();
      return res.json({breaks: false});
    }
    conn.client.query(SELECT_BROKEN_RELATION + ' WHERE relations.relation_no = $3', [selfUserid, selfUserid, relationNo], (err, result) => {
      conn.done();
      if (err) {
        console.error(req.receivedAt, 'BreakRelation. sql SELECT_RELATION error.', err);
        return res.json({breaks: false});
      }
      var relation = result.rows[0];
      if (!relation) {
        console.error(req.receivedAt, 'BreakRelation. no relation.');
        return res.json({breaks: false});
      }
      console.log(req.receivedAt, 'BreakRelation. success.');
      // sendRelation(selfUserid, relation, conn, wss);
      res.json({
        breaks: true,
        relation: relation,
      });
    });
  });
};

const getVoice = (req, res) => {
  var conn = req.connection,
      userInfo = req.session.userInfo,
      selfUserid = userInfo.userid,
      relationNo = req.params.relation_no,
      offset = req.query.offset,
      limit = req.query.limit;

  if (!relationNo || !validation.isNumber(relationNo)
   || !offset || !validation.isNumber(offset)
   || !limit || !validation.isNumber(limit)) {
    console.error(req.receivedAt, 'GetVoice. illegal parameters.');
    conn.done();
    return res.json({hasNext: false, results: []});
  }
  conn.client.query(SELECT_VOICE, [relationNo, offset, (limit + 1)], (err, result) => {
    conn.done();
    if (err) {
      console.error(req.receivedAt, 'GetVoice. sql SELECT_VOICE error.', err);
      return res.json({hasNext: false, results: []});
    }
    var results = result.rows;
    var hasNext = false;
    if (results.length > limit) {
      hasNext = true;
      results = results.slice(0, limit);
    }
    console.log(req.receivedAt, 'GetVoice. success.');
    return res.json({hasNext: hasNext, results: results});
  });
  return;
};

const sendVoice = (wss, selfUserid, message, conn) => {

  var otherUserid = message.userid,
      contents = message.contents;

  if (!contents.commit) {
    console.log('SendVoice. success dont commit.');
    return wss.sendMessage(otherUserid, {
      type: 'VOICE',
      userid: selfUserid,
      contents: {
        commit: false,
        voice: {
          spoken_at: '',
          userid: selfUserid,
          sentence: contents.sentence,
        },
      }
    }, conn);
  }

  conn.client.query(SELECT_RELATION + ' WHERE other.userid = $3', [selfUserid, selfUserid, otherUserid], function (err, result) {
    if (err) {
      console.error('On Message. sql SELECT_RELATION error.', err);
      return wss.sendMessage(selfUserid, 'send message failure.', conn);
    }
    var relation = result.rows[0];
    if (!relation) {
      console.error('On Message. No relation.');
      return wss.sendMessage(selfUserid, 'send message failure.', conn);
    }
    conn.client.query(INSERT_VOICE, [relation.relation_no, selfUserid, contents.sentence], function (err, result) {
      if (err) {
        console.error('SendVoice. sql INSERT_VOICE error.', err);
        return wss.sendMessage(selfUserid, 'send message failure.', conn);
      }
      console.log('SendVoice. success.');
      wss.sendMessage(relation.userid, {
        type: 'VOICE',
        userid: selfUserid,
        contents: {
          commit: true,
          relation_no: relation.relation_no,
          voice: {
            spoken_at: '',
            userid: selfUserid,
            sentence: contents.sentence,
          },
        }
      }, conn);
    });
  });
}

module.exports = () => {
  return {
    routeRelation: (router) => {
      router.get('/relation', getRelation);
      router.get('/relation/:relation_no', getRelation);
      router.post('/relation', (req, res) => makeRelation(req, res));
      router.delete('/relation/:relation_no', (req, res) => breakRelation(req, res));
      router.get('/relation/:relation_no/voice', getVoice);
      return router;
    },
    socketRelation: (wss) => {
      wss.onReceive('VOICE', 'voiceSender', (selfUserid, message, conn) => sendVoice(wss, selfUserid, message, conn));
      return wss;
    },
  };
};

