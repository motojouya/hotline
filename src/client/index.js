import application from './app';
import xhr from '../lib/xhr_mock';
import store from '../lib/store';
import riot from 'riot';

window.addEventListner('DOMContentLoaded', function (event) {
  var mainTag = document.getElementById('main');
  application(window, document, history, location, xhr, store, mainTag, riot, function (isPause) {
    var loadingClasses = document.getElementById('loading').classList;
    if (isPause) {
      loadingClasses.remove('invisible');
    } else {
      loadingClasses.add('invisible');
    }
  });
});

