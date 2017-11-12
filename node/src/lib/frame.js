
const tagPath = '/app/tag/';
const loadingClassName = 'loading';

export default function (dom) {

  var domItems = {};
  
  var pause = function (isPause) {
    var loading = dom.getElementById(loadingClassName);
    if (isPause) {
      loading.classList.remove('invisible');
    } else {
      loading.classList.add('invisible');
    }
  };
  
  var clear = function (tagId) {
    if (tagId && domItems[tagId]) {
      delete domItems[tagId];
      return;
    }
    for (tagId in domItems) {
      if (domItems.hasOwnProperty(tagId)) {
        domItems[tagId].parentNode.removeChild(domItems[tagId]);
        delete domItems[tagId];
      }
    }
  };
  
  var load = function (tagId, tagName, callback) {
  
    var bodyTag = dom.getElementById('body'),
        section = dom.createElement('section'),
        tag = dom.createElement(tagName),
        script = dom.createElement('script');
  
    script.onload = function (event) {
      callback();
    };
    script.src = tagPath + tagName + '.js';
    section.appendChild(script);
    section.appendChild(tag);
    section.setAttribute('id', tagId);
  
    bodyTag.appendChild(section);
    domItems[tagId] = section;
  };

  var whenErr = function () {
    pause(false);
    dom.getElementById('error').classList.remove('invisible');
  };

  var getSRC = function (obj) {
    return window.URL.createObejectURL(obj);
  };

  return {
    pause: pause,
    clear: clear,
    load: load,
    getSRC: getSRC,
    whenErr: whenErr,
  };
};

