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
    done();
  });
});

after(function (done) {
  exec(PSQL + ' -f ' + __dirname + '/truncate.sql', function (error, stdout, stderr) {
    console.log('Exec error: ' + error);
    done();
  });
});

beforeEach(() => {
  browser.reload().url(BASE + '/app');
});

function takeScreenShot(filename) {
  if (process.env.NODE_ENV == 'develop') {
    browser.saveScreenshot('../errorShots/' + filename + '.png');
  }
}

/*
 *  <input type="text" class="modal_input" ref="userid" />
 *  <input type="password" class="modal_input" ref="password">
 *  <button type="button" onclick={login}>ログイン</button>
 */
describe('Login', () => {

  it('login userid empty', () => {
    let message = browser
        .setValue('input[ref="userid"]', '')
        .setValue('input[ref="password"]', 'pw01')
        .click('button')
        .getText('=ユーザIDもしくはパスワードが違います');
    expect(message).toBe('ユーザIDもしくはパスワードが違います');
  });

  it('login userid different', () => {
    let message = browser
        .setValue('input[ref="userid"]', 'testuser10')
        .setValue('input[ref="password"]', 'pw01')
        .click('button')
        .getText('=ユーザIDもしくはパスワードが違います');
    expect(message).toBe('ユーザIDもしくはパスワードが違います');
  });

  it('login password empty', () => {
    let message = browser
        .setValue('input[ref="userid"]', 'testuser01')
        .setValue('input[ref="password"]', '')
        .click('button')
        .getText('=ユーザIDもしくはパスワードが違います');
    expect(message).toBe('ユーザIDもしくはパスワードが違います');
  });

  it('login password different', () => {
    let message = browser
        .setValue('input[ref="userid"]', 'testuser01')
        .setValue('input[ref="password"]', 'pw10')
        .click('button')
        .getText('=ユーザIDもしくはパスワードが違います');
    expect(message).toBe('ユーザIDもしくはパスワードが違います');
  });

  it('login ok', () => {
    let ulClass = browser
        .setValue('input[ref="userid"]', 'testuser01')
        .setValue('input[ref="password"]', 'pw01')
        .click('button')
        .getAttribute('ul', 'class');
    expect(ulClass).toBe('relation_list');
    takeScreenShot('login_success');
  });
});

