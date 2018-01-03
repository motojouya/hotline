'use strict';

const assert = require('assert');
const webdriverio = require('webdriverio');
var childProcess = require('child_process');
var SCHEME = 'http';
var HOST = process.env.APP_HOST;
var PORT = process.env.APP_PORT;
var BASE = SCHEME + '://' + HOST + ':' + PORT;

var PSQL = 'psql -h ' + process.env.DB_HOST
             + ' -p ' + process.env.DB_PORT
             + ' -d ' + process.env.DB_NAME
             + ' -U ' + process.env.DB_USER;
var exec = childProcess.exec;
var options = {
  desiredCapabilities: {
    browserName: 'phantom'
  }
};

const client = webdriverio.remote(options);

before(function (done) {
  exec(PSQL + ' -f ' + __dirname + '/data.sql', function (error, stdout, stderr) {
    console.log('Exec error: ' + error);
    browser
        .setValue('input[ref="userid"]', 'testuser01')
        .setValue('input[ref="password"]', 'pw01')
        .click('button');
    done();
  });
});

after(function (done) {
  takeScreenShot('relation_finish');
  exec(PSQL + ' -f ' + __dirname + '/truncate.sql', function (error, stdout, stderr) {
    console.log('Exec error: ' + error);
    done();
  });
});

beforeEach(() => {
  browser.url(BASE + '/app');
});

function takeScreenShot(filename) {
  if (process.env.NODE_ENV == 'develop') {
    browser.saveScreenshot('../errorShots/' + filename + '.png');
  }
}

describe('Relation', () => {

  it('relation apply userid empty', () => {
    browser
      .click('a[href="/app/relation/12"]')
      .setValue('input[ref="userid"]', '')
      .setValue('input[ref="countersign"]', 'cs12')
      .click('button[ref="apply"]')
      .alertAccept();
  });

  it('relation apply userid illegal', () => {
    browser
      .click('a[href="/app/relation/12"]')
      .setValue('input[ref="userid"]', 'testuser*12')
      .setValue('input[ref="countersign"]', 'cs12')
      .click('button[ref="apply"]')
      .alertAccept();
  });

  it('relation apply countersign empty', () => {
    browser
      .click('a[href="/app/relation/12"]')
      .setValue('input[ref="userid"]', 'testuser12')
      .setValue('input[ref="countersign"]', '')
      .click('button[ref="apply"]')
      .getText();
  });

  it('relation apply countersign empty', () => {
    browser
      .click('a[href="/app/relation/12"]')
      .setValue('input[ref="userid"]', 'testuser12')
      .setValue('input[ref="countersign"]', 'cs*12')
      .click('button[ref="apply"]')
      .alertAccept();
  });

  it('relation apply success', () => {
    let url = browser
      .click('a[href="/app/relation/12"]')
      .setValue('input[ref="userid"]', 'testuser12')
      .setValue('input[ref="countersign"]', 'cs12')
      .click('button[ref="apply"]')
      .getURL();
    expect(url).toBe(BASE + '/app/relation/12');
  });

  it('relation accept countersign empty', () => {
    browser
      .click('a[href="/app/relation/11"]')
      .setValue('input[ref="userid"]', 'testuser11')
      .setValue('input[ref="countersign"]', '')
      .click('button[ref="apply"]')
      .getText();
  });

  it('relation accept countersign empty', () => {
    browser
      .click('a[href="/app/relation/11"]')
      .setValue('input[ref="userid"]', 'testuser11')
      .setValue('input[ref="countersign"]', 'cs*11')
      .click('button[ref="apply"]')
      .alertAccept();
  });

  it('relation accept success', () => {
    let url = browser
      .click('a[href="/app/relation/11"]')
      .setValue('input[ref="userid"]', 'testuser11')
      .setValue('input[ref="countersign"]', 'cs11')
      .click('button[ref="apply"]')
      .getURL();
    expect(url).toBe(BASE + '/app/relation/11');
  });

  it('relation accept deny', () => {
    let url = browser
      .click('a[href="/app/relation/13"]')
      .click('button[ref="deny"]')
      .getURL();
    expect(url).toBe(BASE + '/app');
  });

  it('relation chat single', () => {
    let text = browser
      .click('a[href="/app/relation/11"]')
      .setValue('textarea', 'テスト')
      .getText('textarea');
    expect(text).toBe('');
  });

  it('relation chat double', () => {
    let text = browser
      .click('a[href="/app/relation/11"]')
      .setValue('textarea', '試験')
      .getText('textarea');
    expect(text).toBe('試験');
  });

  it('relation chat double', () => {
    let url = browser
      .click('a[href="/app/relation/11"]')
      .click('button[type="button"]')
      .click('=さよなら')
      .getURL();
    expect(url).toBe(BASE + '/app');
  });

});

