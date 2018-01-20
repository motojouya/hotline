
const indexedDB = self.indexedDB || self.mozIndexedDB || self.webkitIndexedDB || self.msIndexedDB;
const IDBTransaction = self.IDBTransaction || self.webkitIDBTransaction || self.msIDBTransaction || {READ_WRITE: "readwrite"};
const IDBKeyRange = self.IDBKeyRange || self.webkitIDBKeyRange || self.msIDBKeyRange;

const VERSION = 1;
const DB_NAME = 'hostline';

let db;
const objectStrores ={};

const initDB = (OBJECT_STORES) => {
  const openReq = indexedDB.open(DB_NAME, VERSION);
  openReq.onupgradeneeded = (event) => {
    const db = event.target.result;
    event.target.transaction.onerror = (err) => {
      console.log("XXX0", err);
    };
    for (let storeConfigKey in OBJECT_STORES) {
      if (OBJECT_STORES.hasOwnProperty(storeConfigKey)) {
        var storeConfig = OBJECT_STORES[storeConfigKey];
        const name = storeConfig.name;
        if (db.objectStoreNames.contains(name)) {
          db.deleteObjectStore(name);
        }
        objectStrores[name] = db.createObjectStore(name, storeConfig.option);
        if (storeConfig.func) {
          storeConfig.func(objectStrores[name]);
        }
      }
    }
    // OBJECT_STORES.forEach((storeConfig) => {
    //   const name = storeConfig.name;
    //   if (db.objectStoreNames.contains(name)) {
    //     db.deleteObjectStore(name);
    //   }
    //   objectStrores[name] = db.createObjectStore(name, storeConfig.option);
    //   if (storeConfig.func) {
    //     storeConfig.func(objectStrores[name]);
    //   }
    // });
  };
  openReq.onsuccess = (event) => {
    db = (event.target) ? event.target.result : event.result;
  };
  openReq.onerror = (event) => {
    console.log('db open error');
  };
};

const putItem = (storeName, data, tranx) => {
  const putReq = tranx.objectStore(storeName).put(data);
  putReq.onsuccess = (event) => {
    console.log('TODO');
  };
  putReq.onerror = (err) => {
    console.log('TODO', err);
  };
}; 

const put = (storeName, data, callback) => {

  const tranx = db.transaction([storeName], 'readwrite');
  tranx.oncomplete = () => {
    callback();
  };
  tranx.onerror = (err) => {
    console.log('TODO', err);
  };

  if (Array.isArray(data)) {
    data.forEach((item) => {
      putItem(storeName, item, tranx);
    });
  } else {
    putItem(storeName, data, tranx);
  }
};

const del = (storeName, key) => {
  const deleteReq = db.transaction([storeName], 'readwrite').objectStore(storeName).delete(key);
  deleteReq.onsuccess = (event) => {
    console.log('TODO');
  };
  deleteReq.onerror = (err) => {
    console.log('TODO', err);
  };
};

const get = (storeName, key, callback) => {
  const getReq = db.transaction(storeName, 'readonly').objectStore(storeName).get(key);
  getReq.onsuccess = (event) => {
    callback(event.target.result);
  }
  getReq.onerror = (err) => {
    console.log('TODO', err);
  }
};

const getAll = (storeName, callback) => {

  const results = [];
  const cursorReq = db.transaction(storeName, 'readonly').objectStore(storeName).openCursor();
  cursorReq.onsuccess = (event) => {
    const result = event.target.result;
    if (result) {
      results.push(result.value);
      result.continue();
    } else {
      return callback(results);
    }
  };
  cursorReq.onerror = (event) => {
    console.log('TODO', err);
  };
};

const getByIndexOnly = (storeName, key, value, order, callback) => {

  const results = [];
  const cursorReq = db.transaction(storeName, 'readonly')
                    .objectStore(storeName)
                    .index(key)
                    .openCursor(IDBKeyRange.only(value), order);
  cursorReq.onsuccess = (event) => {
    const result = event.target.result;
    if (result) {
      results.push(result.value);
      result.continue();
    } else {
      return callback(results);
    }
  };
  cursorReq.onerror = (event) => {
    console.log('TODO', err);
  };
};

const deleteDB = () => {
  const deleteReq = indexedDB.deleteDatabase(DB_NAME);
  deleteReq.onsuccess = (event) => {
    console.log('db delete success');
    db = null;
  }
  deleteReq.onerror = () => {
    console.log('db delete error');
  }
};

const closeDB = () => {
  db.close();
  db = null;
};

export default (OBJECT_STORES) => {
  if (!indexedDB) {
    console.log('cant use indexeddb.');
  }
  if (!db) {
    initDB(OBJECT_STORES);
  }
  return {
    put: put,
    get: get,
    getAll: getAll,
    getByIndexOnly: getByIndexOnly,
    del: del,
    closeDB: closeDB,
    deleteDB: deleteDB,
  };
};

