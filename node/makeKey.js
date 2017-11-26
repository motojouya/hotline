'use strict';

const fs = require('fs');
const webpush = require('web-push');
const dest = 'application-server-keys.json';

if (fs.existsSync(dest)) {
  return console.log(`[post-install:ABORT] ${dest} file already exits.`);
}

const {publicKey, privateKey} = webpush.generateVAPIDKeys();
fs.writeFileSync(dest, JSON.stringify({publicKey, privateKey}, null, 2));

