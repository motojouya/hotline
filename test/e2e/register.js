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
  browser.reload().url(BASE + '/register');
});

function takeScreenShot(filename) {
  if (process.env.NODE_ENV == 'develop') {
    browser.saveScreenshot('../errorShots/' + filename + '.png');
  }
}

describe('Register', () => {

  it('register userid empty', () => {
    let buttonStatus = browser
        .setValue('input[name="userid"]', '')
        .setValue('input[name="email"]', 'testuser21@gmail.com')
        .setValue('input[name="countersign"]', 'cs21')
        .setValue('input[name="password"]', 'pw21')
        .setValue('input[name="password_again"]', 'pw21')
        .getAttribute('#register_execute', 'disabled');
    expect(buttonStatus).toBe('disabled');
  });

  it('register userid used', () => {
    let buttonStatus = browser
        .setValue('input[name="userid"]', 'testuser01')
        .setValue('input[name="email"]', 'testuser21@gmail.com')
        .setValue('input[name="countersign"]', 'cs21')
        .setValue('input[name="password"]', 'pw21')
        .setValue('input[name="password_again"]', 'pw21')
        .getAttribute('#register_execute', 'disabled');
    expect(buttonStatus).toBe('disabled');
  });

  it('register userid illegal character', () => {
    let buttonStatus = browser
        .setValue('input[name="userid"]', 'testuser21*')
        .setValue('input[name="email"]', 'testuser21@gmail.com')
        .setValue('input[name="countersign"]', 'cs21')
        .setValue('input[name="password"]', 'pw21')
        .setValue('input[name="password_again"]', 'pw21')
        .getAttribute('#register_execute', 'disabled');
    expect(buttonStatus).toBe('disabled');
  });

  it('register email empty', () => {
    let buttonStatus = browser
        .setValue('input[name="userid"]', 'testuser21')
        .setValue('input[name="email"]', '')
        .setValue('input[name="countersign"]', 'cs21')
        .setValue('input[name="password"]', 'pw21')
        .setValue('input[name="password_again"]', 'pw21')
        .getAttribute('#register_execute', 'disabled');
    expect(buttonStatus).toBe('disabled');
  });

  it('register email illegal character', () => {
    let buttonStatus = browser
        .setValue('input[name="userid"]', 'testuser21')
        .setValue('input[name="email"]', 'testuser21*gmail.com')
        .setValue('input[name="countersign"]', 'cs21')
        .setValue('input[name="password"]', 'pw21')
        .setValue('input[name="password_again"]', 'pw21')
        .getAttribute('#register_execute', 'disabled');
    expect(buttonStatus).toBe('disabled');
  });

  it('register countersign empty', () => {
    let buttonStatus = browser
        .setValue('input[name="userid"]', 'testuser21')
        .setValue('input[name="email"]', 'testuser21@gmail.com')
        .setValue('input[name="countersign"]', '')
        .setValue('input[name="password"]', 'pw21')
        .setValue('input[name="password_again"]', 'pw21')
        .getAttribute('#register_execute', 'disabled');
    expect(buttonStatus).toBe('disabled');
  });

  it('register countersign illegal character', () => {
    let buttonStatus = browser
        .setValue('input[name="userid"]', 'testuser21')
        .setValue('input[name="email"]', 'testuser21@gmail.com')
        .setValue('input[name="countersign"]', 'cs*21')
        .setValue('input[name="password"]', 'pw21')
        .setValue('input[name="password_again"]', 'pw21')
        .getAttribute('#register_execute', 'disabled');
    expect(buttonStatus).toBe('disabled');
  });

  it('register password empty', () => {
    let buttonStatus = browser
        .setValue('input[name="userid"]', 'testuser21')
        .setValue('input[name="email"]', 'testuser21@gmail.com')
        .setValue('input[name="countersign"]', 'cs21')
        .setValue('input[name="password"]', '')
        .setValue('input[name="password_again"]', '')
        .getAttribute('#register_execute', 'disabled');
    expect(buttonStatus).toBe('disabled');
  });

  it('register password illegal character', () => {
    let buttonStatus = browser
        .setValue('input[name="userid"]', 'testuser21')
        .setValue('input[name="email"]', 'testuser21@gmail.com')
        .setValue('input[name="countersign"]', 'cs21')
        .setValue('input[name="password"]', 'pw*21')
        .setValue('input[name="password_again"]', 'pw*21')
        .getAttribute('#register_execute', 'disabled');
    expect(buttonStatus).toBe('disabled');
  });

  it('register password again different', () => {
    let buttonStatus = browser
        .setValue('input[name="userid"]', 'testuser21')
        .setValue('input[name="email"]', 'testuser21@gmail.com')
        .setValue('input[name="countersign"]', 'cs21')
        .setValue('input[name="password"]', 'pw21')
        .setValue('input[name="password_again"]', 'wp21')
        .getAttribute('#register_execute', 'disabled');
    expect(buttonStatus).toBe('disabled');
  });

  it('register ok', () => {
    let buttonStatus = browser
        .setValue('input[name="userid"]', 'testuser21')
        .setValue('input[name="email"]', 'testuser21@gmail.com')
        .setValue('input[name="countersign"]', 'cs21')
        .setValue('input[name="password"]', 'pw21')
        .setValue('input[name="password_again"]', 'pw21')
        .getAttribute('#register_execute', 'disabled');
    expect(buttonStatus).toBe('');
  });

  it('register execute', () => {
    let buttonStatus = browser
        .setValue('input[name="userid"]', 'testuser21')
        .setValue('input[name="email"]', 'testuser21@gmail.com')
        .setValue('input[name="countersign"]', 'cs21')
        .setValue('input[name="password"]', 'pw21')
        .setValue('input[name="password_again"]', 'pw21')
        .click('#register_execute')
        .getAttribute('#register_execute', 'disabled');
    expect(buttonStatus).toBe('disabled');
    takeScreenShot('register_success');
  });
});

