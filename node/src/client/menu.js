
var getRelationsObj = function (observe) {
  var relationDic = {};
  observe(relationDic);

  relationDic.set = function (relationAry) {
    var i = 0,
        len = relationAry.length,
        relation,
        key,
        obj;
  
    for (; i < len; i++) {
      obj = relationAry[i];
      relation = relationDic[obj.relation_no] || {};
  
      for (key in obj) {
        if (obj.hasOwnProperty(key)) {
          relation[key] = obj[key];
        }
      }
      relationDic[obj.relation_no] = relation;
    }
  };
  return relationDic;
};

var connect = function (relationDic, api) {
  api.onReceive('RELATE', 'relations', function (payload) {
    relationDic.set(payload);
  });

  return function (path) {
    api.cancelListener('RELATE', 'relations');
    route(path);
  };
};

export default function (frame, api, riot, route) {
  route('/app', function () {

    var relationDic = getRelationsObj(riot.observable),
        transfer = connect(relationDic, api),
        relationLoaded = false,
        domLoaded = false;

    var build = function () {
      riot.mount('section#menu > menu', 'menu', {
        schema: relationDic,
        duties: {transfer: transfer}
      });
      frame.pause(false);
    };

    frame.pause(true);
    frame.clear();

    frame.load('menu', 'menu', function () {
      if (relationLoaded) {
        build();
      }
      domLoaded = true;
    });
    api.loadRelations(0, function (result) {
      relationDic.set(result.payload);
      if (domLoaded && !relationLoaded) {
        build();
      }
      relationLoaded = true;
    });

  });
};

