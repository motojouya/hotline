import agent from 'superagent';

export default (whenErr) => {

  const get = (path, parameters, callback) => {
    if (!callback) {
      callback = parameters;
      parameters = {};
    }
    agent.get(path).query(parameters)
      .end((err, res) => {
        if (err) {
          whenErr();
        }
        callback(res.body);
      });
  };

  const post = (path, parameters, callback) => {
    if (!callback) {
      callback = parameters;
      parameters = {};
    }
    agent.post(path).send(parameters)
      .end((err, res) => {
        if (err) {
          whenErr();
        }
        callback(res.body);
      });
  };

  const del = (path, callback) => {
    agent.delete(path)
      .end((err, res) => {
        if (err) {
          whenErr();
        }
        callback(res.body);
      });
  };

  const put = (path, parameters, callback) => {
    if (!callback) {
      callback = parameters;
      parameters = {};
    }
    agent.put(path).send(parameters)
      .end((err, res) => {
        if (err) {
          whenErr();
        }
        callback(res.body);
      });
  };

  const getQueryDictionary = (query) => {

    if (!query) {
      return;
    }
    const paramEntry = query.slice(1).split('&'),
          len = paramEntry.length,
          queryDic = {};

    for (let i = 0;i < len; i++) {
      let queryItem = paramEntry[i].split('=');
      queryDic[queryItem[0]] = queryItem[1];
    }
    return queryDic;
  };

  return {
    get: get,
    post: post,
    put: put,
    del: del,
    getQueryDictionary: getQueryDictionary,
  };
};

