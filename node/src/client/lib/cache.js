'use strict';

const loadCaches = (caches, transmitter, cacheName, filePaths) => {
  return caches.open(cacheName).then((cache) => {
    return Promise.all(filePaths.map((url) => {
      return transmitter.fetch(new transmitter.Request(url)).then((response) => {
        if (response.ok) {
          return cache.put(response.url, response);
        } else {
          return Promise.reject('Invalid response.  URL:' + response.url + ' Status: ' + response.status);
        }
      });
    }));
  });
};

const deleteOldCaches = (caches, cacheNameNow) => {
  return caches.keys().then((keys) => {
    const deletes = keys
      .filter(cacheName => cacheNameNow !== cacheName)
      .map(cacheName => caches.delete(cacheName))
    return Promise.all(deletes);
  });
};

export default {
  loadCaches,
  deleteOldCaches,
};

