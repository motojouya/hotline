'use strict';

import agent from 'superagent';

const urlB64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

var swRegistration;
var vapidKey;

const registerPushManager = (xhr, swRegistration, vapidKey) => {
  swRegistration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlB64ToUint8Array(vapidKey),
  }).then(subscription => {
    xhr.registerWebPush(subscription, (err, res) => {
      if (err) {
        console.log("Subscribe Error:", err);
      }
    });
  });
};

const registerServiceWorker = (xhr, navigator) => {
  xhr.getVapidKey((vapidkey) => {
    vapidKey = vapidkey;
    if (swRegistration) {
      registerPushManager(xhr, swRegistration, vapidKey);
    }
  });
  navigator.serviceWorker.ready.then((registration) => {
    swRegistration = registration;
    if (vapidKey) {
      registerPushManager(xhr, swRegistration, vapidKey);
    }
  });
};

const requestNotificationPermission => (navigator, callback) {
  Notification.requestPermission((permission) => {
    if (permission !== 'denied') {
      if ('permissions' in navigator) {
        navigator.permissions.query({
          name: 'push',
          userVisibleOnly: true
        }).then((event) => {
          let state = event.state || event.status;
          if (state !== 'denied') {
            callback();
          }
        });
      } else if (Notification.permission !== 'denied') {
        callback();
      }
    }
  });
}

export default (xhr, navigator) => {
  requestNotificationPermission(navigator, () => registerServiceWorker(xhr, navigator));
};

