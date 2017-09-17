import application from './app';
import xhr from '../lib/xhr_mock';
import store from '../lib/store';

window.addEventListener('DOMContentLoaded', function (event) {
  var bodyTag = document.getElementById('body');
  application(window, document, history, location, xhr, store, bodyTag, riot, function (isPause) {
    var loadingClasses = document.getElementById('loading').classList;
    if (isPause) {
      loadingClasses.remove('invisible');
    } else {
      loadingClasses.add('invisible');
    }
  });
});

