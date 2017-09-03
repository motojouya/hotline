riot.tag2('menu', '<div class="titlebar"> <h3 class="title">PSPS</h3> <span class="configlink"><a href="config" onclick="{move}">設定</a></span> </div> <ul class="userlist"> <li> <a href="relation" onclick="{move}">+つながる</a> </li> <li class="relateduser" each="{relationAry}"> <a href="relation/{userid}" onclick="{parent.move}">{name}</a> </li> </ul>', 'menu .titlebar,[data-is="menu"] .titlebar{ } menu .title,[data-is="menu"] .title{ display: inline-block; } menu .configlink,[data-is="menu"] .configlink{ } menu .userlist,[data-is="menu"] .userlist{ list-style: none; } menu .relateduser,[data-is="menu"] .relateduser{ }', '', function(opts) {

  var relationMap = opts.schema
    , duties = opts.duties
    , key;

  this.relationAry = []

  relationMap.on('change', function (){
    this.update();
  });

  for (key in relationMap) {
    if (relationMap.hasOwnProperty(key)) {
      this.relationAry.push(relationMap[key]);
    }
  }
  this.relationAry.sort(function (left, right) {
    return left.updateAt = right.updateAt;
  });

  this.move = function(event) {
    event.preventDefault();
    duties.transfer(event.target.pathname);
  }.bind(this)
});
