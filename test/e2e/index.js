console.log('it\'s empty!');

const assert = require('assert');
const webdriverio = require('webdriverio');
var webdriverio = require('webdriverio');
var options = {
  desiredCapabilities: {
    browserName: 'phantom'
  }
};

webdriverio
  .remote(options)
  .init()
  .url('http://www.gaprot.jp')
  .getTitle().then(function(title) {
      console.log('Title was: ' + title);
  })
  .end();





// configしてれば、以下のようにできる
// webdriverio.remote(options).init() -> browser





describe('todo tests', () => {
  let client;

  before(() => {
    client = webdriverio.remote();
    return client.init();
  });

  it('todo list test', () => {
    return client
      .url('http://localhost:4000')
      .getTitle()
      .then(title => assert.equal(title, 'My to-do list'));
  });
});





describe('top page', function () {
  describe('my feature', function() {
    it('should do something', function *() {
      yield browser
          .url('https://duckduckgo.com/')
          .setValue('#search_form_input_homepage', 'WebdriverIO')
          .click('#search_button_homepage');

      var title = yield browser.getTitle();
      console.log(title); // outputs: "Title is: WebdriverIO (Software) at DuckDuckGo"
    });
  });
});





describe('WDIOのテスト', () => {
    it('画面の表示', () => {
        browser.url('/index.html');
        expect(browser.getTitle()).toBe('Hello WebdriverIO');
    });  
});
describe('Login Page', () => {
    beforeEach(() => {
        browser.url('/index.html');
    });
 
    it('should translate to todo list when submit correct userid & password', () => {
        let title = browser.setValue('#userid', 'test@example.com')
            .setValue('#password', 'password')
            .click('#login')
            .getTitle();
        expect(title).toBe('Login Succeeded');
    });
});
describe('Login Page', () => {
    beforeEach(() => {
        browser.url('/login.php');
    });
    it('should have right title', () => {
        browser.saveScreenshot('./images/login.png');
    });
});



