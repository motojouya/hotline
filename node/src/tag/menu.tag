<menu>
<div class="titlebar">
  <h3 class="title">PSPS</h3>
  <span class="configlink"><a href="/app/config/" onclick={move}>設定</a></span>
</div>
<ul class="userlist">
  <li>
    <a href="/app/relation" onclick={move}>+つながる</a>
  </li>
  <li class="relateduser" each={relationAry}>
    <a href="/app/relation/{userid}/" onclick={parent.move}>{name}</a>
  </li>
</ul>
<script>

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

  move(event) {
    event.preventDefault();
    duties.transfer(event.target.pathname);
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
