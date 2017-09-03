<menu>
<div class="titlebar">
  <h3 class="title">PSPS</h3>
  <span class="configlink"><a href="config" onclick={parent.move}>設定</a></span>
</div>
<ul class="userlist">
  <li>
    <a href="/app/relation" onclick={parent.move}>+つながる</a>
  </li>
  <li class="relateduser" each={relationAry}>
    <a href="/app/relation/{userid}" onclick={parent.move}>{name}</a>
  </li>
</ul>
<script>
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

  move(event) {
    event.preventDefault();
    duties.transfer(event.target.a.href);
  }
</script>
<style>
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
</style>
</menu>
