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
  takeScreenShot('config_finish');
  exec(PSQL + ' -f ' + __dirname + '/truncate.sql', function (error, stdout, stderr) {
    console.log('Exec error: ' + error);
    done();
  });
});

beforeEach(() => {
  browser.url(BASE + '/app/config');
});

function takeScreenShot(filename) {
  if (process.env.NODE_ENV == 'develop') {
    browser.saveScreenshot('../errorShots/' + filename + '.png');
  }
}

describe('Config', () => {

  it('config userid', () => {
    let userid = browser.getText('=testuser01');
    expect(userid).toBe('testuser01');
  });

  it('config name cancel', () => {
    let name = browser
        .click('[name="name"] button')
        .setValue('input[ref="input_text"]', '試験 キャンセル')
        .click('button[ref="cancel"]')
        .getText('[name="name"] span');
    expect(name).toBe('試験 零一');
  });

  it('config name empty', () => {
    let name = browser
        .click('[name="name"] button')
        .setValue('input[ref="input_text"]', '')
        .click('button[ref="confirm"]')
        .alertAccept()
        .getText('[name="name"] span');
    expect(name).toBe('試験 零一');
  });

  it('config name confirm cancel', () => {
    let name = browser
        .click('[name="name"] button')
        .setValue('input[ref="input_text"]', '試験 キャンセル')
        .click('button[ref="confirm"]')
        .click('button[ref="cancel"]')
        .getText('[name="name"] span');
    expect(name).toBe('試験 零一');
  });

  it('config name change', () => {
    let name = browser
        .click('[name="name"] button')
        .setValue('input[ref="input_text"]', '試験 変更')
        .click('button[ref="confirm"]')
        .click('button[ref="confirm"]')
        .getText('[name="name"] span');
    expect(name).toBe('試験 零一');
  });

  it('config email cancel', () => {
    let email = browser
        .click('[name="email"] button')
        .setValue('input[ref="input_text"]', 'cancel@gmail.com')
        .click('button[ref="cancel"]')
        .getText('[name="email"] span');
    expect(email).toBe('testuser01@gmail.com');
  });

  it('config email empty', () => {
    let email = browser
        .click('[name="email"] button')
        .setValue('input[ref="input_text"]', '')
        .click('button[ref="confirm"]')
        .alertAccept()
        .getText('[name="email"] span');
    expect(email).toBe('testuser01@gmail.com');
  });

  it('config email illegal', () => {
    let email = browser
        .click('[name="email"] button')
        .setValue('input[ref="input_text"]', 'change*gmail.com')
        .click('button[ref="confirm"]')
        .alertAccept()
        .getText('[name="email"] span');
    expect(email).toBe('testuser01@gmail.com');
  });

  it('config email confirm cancel', () => {
    let email = browser
        .click('[name="email"] button')
        .setValue('input[ref="input_text"]', 'cancel@gmail.com')
        .click('button[ref="confirm"]')
        .click('button[ref="cancel"]')
        .getText('[name="email"] span');
    expect(email).toBe('testuser01@gmail.com');
  });

  it('config email change', () => {
    let email = browser
        .click('[name="email"] button')
        .setValue('input[ref="input_text"]', 'change@gmail.com')
        .click('button[ref="confirm"]')
        .click('button[ref="confirm"]')
        .getText('[name="email"] span');
    expect(email).toBe('change@gmail.com');
  });

  it('config countersign cancel', () => {
    let countersign = browser
        .click('[name="countersign"] button')
        .setValue('input[ref="input_text"]', 'sc01')
        .click('button[ref="cancel"]')
        .getText('[name="countersign"] span');
    expect(countersign).toBe('cs01');
  });

  it('config countersign empty', () => {
    let countersign = browser
        .click('[name="countersign"] button')
        .setValue('input[ref="input_text"]', '')
        .click('button[ref="confirm"]')
        .alertAccept()
        .getText('[name="countersign"] span');
    expect(countersign).toBe('cs01');
  });

  it('config countersign illegal', () => {
    let countersign = browser
        .click('[name="countersign"] button')
        .setValue('input[ref="input_text"]', 'cs*01')
        .click('button[ref="confirm"]')
        .alertAccept()
        .getText('[name="countersign"] span');
    expect(countersign).toBe('cs01');
  });

  it('config countersign confirm cancel', () => {
    let countersign = browser
        .click('[name="countersign"] button')
        .setValue('input[ref="input_text"]', 'sc01')
        .click('button[ref="confirm"]')
        .click('button[ref="cancel"]')
        .getText('[name="countersign"] span');
    expect(countersign).toBe('cs01');
  });

  it('config countersign change', () => {
    let countersign = browser
        .click('[name="countersign"] button')
        .setValue('input[ref="input_text"]', 'sc01')
        .click('button[ref="confirm"]')
        .click('button[ref="confirm"]')
        .getText('[name="countersign"] span');
    expect(countersign).toBe('sc01');
  });

  it('config password cancel', () => {
    let password = browser
        .click('[name="password"] button')
        .setValue('input[ref="old_password"]', 'pw01')
        .setValue('input[ref="new_password"]', 'wp01')
        .click('button[ref="cancel"]')
        .getText('[name="password"] span');
    expect(password).toBe('********');
  });

  it('config password empty', () => {
    let password = browser
        .click('[name="email"] button')
        .setValue('input[ref="old_password"]', '')
        .setValue('input[ref="new_password"]', '')
        .click('button[ref="confirm"]')
        .alertAccept()
        .getText('[name="email"] span');
    expect(password).toBe('********');
  });

  it('config password illegal', () => {
    let password = browser
        .click('[name="email"] button')
        .setValue('input[ref="old_password"]', 'pw*01')
        .setValue('input[ref="new_password"]', 'wp*01')
        .click('button[ref="confirm"]')
        .alertAccept()
        .getText('[name="email"] span');
    expect(password).toBe('********');
  });

  it('config password same', () => {
    let password = browser
        .click('[name="email"] button')
        .setValue('input[ref="old_password"]', 'pw01')
        .setValue('input[ref="new_password"]', 'pw01')
        .click('button[ref="confirm"]')
        .alertAccept()
        .getText('[name="email"] span');
    expect(password).toBe('********');
  });

  it('config password confirm cancel', () => {
    let password = browser
        .click('[name="password"] button')
        .setValue('input[ref="old_password"]', 'pw01')
        .setValue('input[ref="new_password"]', 'wp01')
        .click('button[ref="confirm"]')
        .click('button[ref="cancel"]')
        .getText('[name="password"] span');
    expect(password).toBe('********');
  });

  it('config password failure', () => {
    //TODO エラーの判別がつきづらい
    let password = browser
        .click('[name="email"] button')
        .setValue('input[ref="old_password"]', 'wp01')
        .setValue('input[ref="new_password"]', 'pw01')
        .click('button[ref="confirm"]')
        .click('button[ref="confirm"]')
        .alertAccept()
        .getText('[name="email"] span');
    expect(password).toBe('********');
  });

  it('config password change', () => {
    let password = browser
        .click('[name="email"] button')
        .setValue('input[ref="old_password"]', 'pw01')
        .setValue('input[ref="new_password"]', 'wp01')
        .click('button[ref="confirm"]')
        .click('button[ref="confirm"]')
        .alertAccept()
        .getText('[name="email"] span');
    expect(password).toBe('********');
  });

  it('config notification never', () => {
    let checked = browser
        .click('input[value="NEVER"]')
        .getAttribute('input[value="NEVER"]', 'checked')
    expect(checked).toBe('checked');
  });

  it('config notification unless', () => {
    let checked = browser
        .click('input[value="UNLESS"]')
        .getAttribute('input[value="UNLESS"]', 'checked')
    expect(checked).toBe('checked');
  });

  it('config notification always', () => {
    let checked = browser
        .click('input[value="ALWAYS"]')
        .getAttribute('input[value="ALWAYS"]', 'checked')
    expect(checked).toBe('checked');
  });

  it('config color min out', () => {
    let style = browser
        .setValue('input[type="range"]', '-1')
        .getAttribute('input[type="range"]', 'style')
    expect(checked).toBe('background-color:77e;');
  });

  it('config color min in', () => {
    let style = browser
        .setValue('input[type="range"]', '0')
        .getAttribute('input[type="range"]', 'style')
    expect(checked).toBe('background-color:77e;');
  });

  it('config color middle', () => {
    let style = browser
        .setValue('input[type="range"]', '8')
        .getAttribute('input[type="range"]', 'style')
    expect(checked).toBe('background-color:7e7;');
  });

  it('config color max out', () => {
    let style = browser
        .setValue('input[type="range"]', '23')
        .getAttribute('input[type="range"]', 'style')
    expect(checked).toBe('background-color:77e;');
  });

  it('config color max out', () => {
    let style = browser
        .setValue('input[type="range"]', '24')
        .getAttribute('input[type="range"]', 'style')
    expect(checked).toBe('background-color:77e;');
  });

});

