'use strict';

var _app = require('./app');

var _app2 = _interopRequireDefault(_app);

var _xhr = require('./xhr');

var _xhr2 = _interopRequireDefault(_xhr);

var _store = require('./store');

var _store2 = _interopRequireDefault(_store);

var _riot = require('riot');

var _riot2 = _interopRequireDefault(_riot);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.addEventListner('DOMContentLoaded', function (event) {
  var mainTag = document.getElementById('main');
  (0, _app2.default)(window, document, history, location, _xhr2.default, _store2.default, mainTag, _riot2.default, function (isPause) {
    var loadingClasses = document.getElementById('loading').classList;
    if (isPause) {
      loadingClasses.remove('invisible');
    } else {
      loadingClasses.add('invisible');
    }
  });
});