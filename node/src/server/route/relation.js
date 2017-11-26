'use strict';

import validation from '../lib/validation';

const INSERT_RELATION = 'INSERT INTO relations (status) VALUES ('PENDING')';
const INSERT_RELATION_USER = 'INSERT INTO relation_user (relation_no, userid, is_applicant) VALUES ($1, $2, $3), ($4, $5, $6)';
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
  + '   AND other.active = TRUE';

const SELECT_VOICE
  = 'SELECT voices.spoken_at'
  + '     , voices.userid'
  + '     , voices.sentence'
  + '  FROM relation_user AS self'
  + ' INNER JOIN relations AS relations'
  + '    ON self.relation_no = relations.relation_no'
  + '   AND self.userid = $1'
  + '   AND relations.status = \'ACTIVE\''
  + ' INNER JOIN relation_user AS other'
  + '    ON relations.relation_no = other.relation_no'
  + '   AND other.userid = $2'
  + ' INNER JOIN voices AS voices
  + '    ON relations.relation_no = voices.relation_no'
  + ' OFFSET $3 LIMIT $4'
  + ' ORDER BY voices.spoken_at DESC';


const getRelation = (req, res) => {
  var conn = req.connection,
      userInfo = req.session.userInfo,
      selfUserid = userInfo.userid,
      otherUserid = req.params.userid,
      offset = req.params.offset,
      limit = req.params.limit,

  if (userid) {
    if (!validation.isASCII(userid) || userid.length > 16) {
      conn.done();
      return console.log('TODO');
    }
    conn.client.query(SELECT_RELATION + ' WHERE other.userid = $3', [selfUserid, selfUserid, otherUserid], (err, result) => {
      conn.done();
      if (err) {
        console.error('TODO', err);
      }
      var relation = result.rows[0];
      if (!relation) {
        console.log('TODO');
      }
      return res.json(relation);
    });
    return;
  }
  if (offset && limit) {
    if (!validation.isNumber(offset) || !validation.isNumber(limit)) {
      conn.done();
      return console.log('TODO');
    }
    conn.client.query(SELECT_RELATION + ' OFFSET $3 LIMIT $4 ORDER BY other.name', [selfUserid, selfUserid, offset, (limit + 1)], (err, result) => {
      conn.done();
      if (err) {
        console.error('TODO', err);
      }
      var results = result.rows;
      var hasNext = false;
      if (results.length > limit) {
        hasNext = true;
        results.pop();
      }
      return res.json({hasNext: hasNext, results: results});
    });
    return;
  }
  conn.done();
  return console.log('TODO');
};

const rollback = (conn) => {
  conn.client.query('ROLLBACK', (err) => {
    if (err) {
      console.error('Error rolling back client', err.stack);
    }
    conn.done();
  });
};

const sendRelation = (selfUserid, relation, conn, wss) => {
  conn.client.query(SELECT_RELATION + ' WHERE other.userid = $3', [relation.userid, relation.userid, selfUserid], (err, result) => {
    if (err) {
      console.error('TODO', err);
      conn.done();
    }
    var relation = result.rows[0];
    wss.sendMessage(relation.userid, relation, conn);
  });
};

const makeRelation = (req, res, wss) => {
  var conn = req.connection,
      userInfo = req.session.userInfo,
      selfUserid = userInfo.userid,
      otherUserid = req.body.userid,
      countersign = req.body.countersign;

  if (!otherUserid || !validation.isASCII(otherUserid)
   || !countersign || !validation.isASCII(countersign)) {
    console.error('TODO', err);
    conn.done();
  }

  conn.client.query(SELECT_USER, [otherUserid, countersign], (err, result) => {
    if (err) {
      console.error('TODO', err);
      return conn.done();
    }
    var user = result.rows[0];
    if (!user) {
      console.log('TODO');
      return conn.done();
    }

    conn.client.query(SELECT_RELATION + ' WHERE other.userid = $3', [selfUserid, selfUserid, otherUserid], (err, result) => {
      if (err) {
        console.error('TODO', err);
        conn.done();
      }
      var relation = result.rows[0];

      if (relation) {
        conn.client.query(UPDATE_RELATION, ['ACTIVE', relation.relation_no], (err, result) => {
          conn.done();
          if (err) {
            console.error('Error committing transaction', err.stack);
          }
          sendRelation(selfUserid, relation, conn, wss);
          res.json(result.rows[0]);
        });

      } else {
        conn.client.query('BEGIN', (err) => {
          if (err) {
            console.error('Error in transaction', err.stack);
            return rollback(conn);
          }
          conn.client.query(INSERT_RELATION, (err, result) => {
            if (err) {
              console.error('Error in transaction', err.stack);
              return rollback(conn);
            }
            relation = result.rows[0];
            if (!relation) {
              console.log('Error in transaction');
              return rollback(conn);
            } 
            var relationNo = relation.relation_no;
            conn.client.query(INSERT_RELATION_USER, [relationNo, selfUserid, true, relationNo, otherUserid, false], (err, result) => {
              if (err) {
                console.error('Error in transaction', err.stack);
                return rollback(conn);
              }
              conn.client.query('COMMIT', (err) => {
                conn.done();
                if (err) {
                  console.error('Error committing transaction', err.stack);
                }
                sendRelation(selfUserid, relation, conn, wss);
                res.json(relation);
              });
            });
          });
        });
      }
    });
  });
};

const breakRelation = (req, res, wss) => {
  var conn = req.connection,
      userInfo = req.session.userInfo,
      selfUserid = userInfo.userid,
      otherUserid = req.body.userid;

  if (!otherUserid || !validation.isASCII(otherUserid)) {
    console.error('TODO', err);
    conn.done();
  }

  conn.client.query(UPDATE_RELATION, ['BROKEN', relation.relation_no], (err, result) => {
    conn.done();
    if (err) {
      console.error('Error committing transaction', err.stack);
    }
    conn.client.query(SELECT_RELATION + ' WHERE other.userid = $3', [selfUserid, selfUserid, otherUserid], (err, result) => {
      conn.done();
      if (err) {
        console.error('TODO', err);
      }
      var relation = result.rows[0];
      sendRelation(selfUserid, relation, conn, wss);
      res.json(relation);
    });
  });
};

const getVoice = (req, res) => {
  var conn = req.connection,
      userInfo = req.session.userInfo,
      selfUserid = userInfo.userid,
      otherUserid = req.params.userid,
      offset = req.params.offset,
      limit = req.params.limit,

  if (!userid || !validation.isASCII(userid) || userid.length > 16
   || !offset || !validation.isNumber(offset)
   || !limit || !validation.isNumber(limit)) {
    console.log('TODO');
    return conn.done();
  }
  conn.client.query(SELECT_VOICE, [selfUserid, otherUserid, offset, (limit + 1)], (err, result) => {
    conn.done();
    if (err) {
      console.error('TODO', err);
    }
    var results = result.rows;
    var hasNext = false;
    if (results.length > limit) {
      hasNext = true;
      results.pop();
    }
    return res.json({hasNext: hasNext, results: results});
  });
  return;
};

const sendVoice = (userInfo, relation, contents, conn) => {
  conn.client.query(INSERT_VOICE, [relation.relation_no, userInfo.userid, contents.voice], function (err, result) {
    conn.done();
    if (err) {
      console.error('TODO', err);
      return;
    }
    var voice = result.rows[0]);
    if (!voice) {
      console.log('TODO');
      return;
    }
    wss.sendMessage(relation.userid, {type: 'VOICE', contents: contents.voice}, conn);
  });
}

export function (router, wss) => {
  router.get('/relation', getRelation);
  router.get('/relation/:userid', getRelation);
  router.post('/relation', (req, res) => makeRelation(req, res, wss));
  router.delete('/relation/:userid', (req, res) => breakRelation(req, res, wss));
  router.get('/relation/:userid/voice', getVoice);
  wss.onReceive('VOICE', 'voiceSender', sendVoice);
  return router;
};

