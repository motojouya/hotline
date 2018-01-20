'use strict';

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

const registerPushManager = (api, swRegistration, vapidKey) => {
  swRegistration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlB64ToUint8Array(vapidKey),
  }).then(subscription => {
    api.post('/api/v1/webpush/vapidkey', subscription, (body) => {
      console.log(body.result);
    });
  });
};

const registerServiceWorker = (api, navigator) => {
  api.get('/api/v1/webpush/vapidkey', (body) => {
    vapidKey = body.publicKey;
    if (swRegistration) {
      registerPushManager(api, swRegistration, vapidKey);
    }
  });
  navigator.serviceWorker.ready.then((registration) => {
    swRegistration = registration;
    if (vapidKey) {
      registerPushManager(api, swRegistration, vapidKey);
    }
  });
};

const requestNotificationPermission = (navigator, callback) => {
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

export default (api, navigator) => {
  requestNotificationPermission(navigator, () => registerServiceWorker(api, navigator));
};

