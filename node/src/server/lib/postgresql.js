'use strict';

const config = {
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_NAME,
  host: process.env.PG_HOST,
  port: PG_PORT,
  ssl: true,
  max: 10,
  min: 4,
  idleTimeoutMillis: 1000
};

var pool,
    connect;

module.export = (postgresql) => {
  if (!pool || !connect) {
    pool = new postgresql.Pool(config);
    connect = (req, res, next) => {
      pool.connect(function(err, client, done) {
        if(err) {
          console.error('TODO', err);
          return;
        }
        let connection = {};
        connection.client = client;
        connection.done = done;
        req.connection = connection;
        next();
      });
    };
  }
  return connect;
}

