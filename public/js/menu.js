<menu>
riot.tag2('div', '<h3 class="title">PSPS</h3> <span class="configlink"><a href="config" onclick="{parent.move}">設定</a></span>', '', 'class="titlebar"', function(opts) {
});
riot.tag2('ul', '<li> <a href="/app/relation" onclick="{parent.move}">+つながる</a> </li> <li class="relateduser" each="{relationAry}"> <a href="/app/relation/{userid}" onclick="{parent.move}">{name}</a> </li>', '', 'class="userlist"', function(opts) {
});
riot.tag2('script', '', '', '', function(opts) {
  this.relationMap = opt.schema;
  this.duties = opt.duties;

  relationMap.on('change', function (){
    this.update();
  });

  var relationAry = []
    , key;

  for (key in relationMap) {
    if (relationMap.hasOwnProperty(key)) {
      relationAry.push(relationMap[key]);
    }
  }
  relationAry.sort(function (left, right) {
    return left.updateAt = right.updateAt;
  });

  this.move = function(event) {
    event.preventDefault();
    duties.transfer(event.target.a.href);
  }.bind(this)
});
riot.tag2('style', '', '', '', function(opts) {
  .titlebar {
  }
  .title {
    display: inline-block;
  }
  .configlink {
  }
  .userlist {
    list-style: none;
  }
  .relateduser {
  }
});
<menu>
