'use strict';

const config = {
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_NAME,
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  ssl: false,
  max: 10,
  min: 4,
  idleTimeoutMillis: 1000
};

var pool;

module.exports = (postgresql) => {

  if (!pool) {
    pool = new postgresql.Pool(config);

    var expressConnect = (req, res, next) => {
      pool.connect(function(err, client, done) {
        if(err) {
          console.error('Connect postgresql pool error.', err);
          done();
          res.status(500);
          return res.json({message: 'Server Error.'});
        }
        let connection = {};
        connection.client = client;
        connection.done = done;
        req.connection = connection;
        next();
      });
    };

    var wsConnect = (callback) => {
      pool.connect(function(err, client, done) {
        if(err) {
          console.error('Connect postgresql pool error.', err);
          done();
          callback(err, null);
        }
        let connection = {};
        connection.client = client;
        connection.done = done;
        callback(null, connection);
      });
    };
  }

  return {
    expressConnect: expressConnect,
    wsConnect: wsConnect,
  }
}

