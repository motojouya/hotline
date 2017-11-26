
const INSERT_WEBPUSH = 'INSERT INTO user_webpush (userid, endpoint, p256dh, auth) VALUES ($1, $2, $3, $4)';
const SELECT_WEBPUSH = 'SELECT endpoint, p256dh, auth FROM user_webpush WHERE userid = $1';

const getVapidKey = (req, res, vapidKeys) => {
  return res.json({publicKey: vapidKeys.publicKey});
};

const registerEndpoint = (req, res, webpush, vapidKeys) => {

  const conn = req.session.connection;
  const userInfo = req.session.userInfo;
  const endpoint = req.body.endpoint;
  const p256dh = req.body.p256dh;
  const auth = req.body.auth;

  if (!conn || !userInfo || !endpoint || !p256dh || !auth) {
    return conn.done();
  }
  conn.client.query('BEGIN', (err) => {
    if (err) {
      console.error('Error in transaction', err.stack);
      return rollback(conn);
    }
    conn.client.query(INSERT_WEBPUSH, [userInfo.userid, endpoint, p256dh, auth], (err, result) => {
      if (err) {
        console.error('Error in transaction', err.stack);
        return rollback(conn);
      }
      var webpush = result.rows[0];
      if (!webpush) {
        console.log('Error in transaction');
        return rollback(conn);
      } 
      conn.client.query('COMMIT', (err) => {
        conn.done();
        if (err) {
          console.error('Error committing transaction', err.stack);
        }
        sendRelation(selfUserid, relation, wss);
        res.json(relation);
      });
    });
  });
};


const sendWebpush = (userid, conn, message, subject, resolve, reject, webpush, vapidKeys) => {
  conn.client.query(SELECT_WEBPUSH, [userInfo.userid], (err, result) => {
    conn.done();
    if (err) {
      console.error('TODO', err);
      return;
    }
    var results = result.rows;
    if (!results) {
      console.log('TODO');
      return;
    }
    var len = results.length;
    for (var i = 0; i < len; i++) {
      
      var pushSubscription = {
          endpoint: results[i].endpoint,
          keys: {
              p256dh: results[i].p256dh,
              auth: results[i].auth,
          }
      };
      var options = {
        TTL: 10000,
        vapidDetails: {
          subject: subject,
          publicKey: vapidKeys.publicKey,
          privateKey: vapidKeys.privateKey,
        }
      };
      webpush.sendNotification(pushSubscription, message, options)
        .then((response)=>{resolve(response)})
        .catch((error) => {reject(error)});
    }
  });

};

module.export = (router, webpush, vapidKeys) => {
  app.get('/webpush/vapidkey', (req, res) => getVapidKey(req, res, vapidKeys));
  app.post('/webpush/register', (req, res) => registerEndpoint(req, res, webpush, vapidKeys));
  return {
    router: router,
    sendWebpush: (userid, conn, message, subject, resolve, reject) => {
      sendWebpush(userid, conn, message, subject, resolve, reject, webpush, vapidKeys);
    }
  };
};

  var message = JSON.stringify({
    title: '',
    body: '',
    icon: '',
    link: '',
  });


