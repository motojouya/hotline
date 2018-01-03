<menu>
<header class="invert buoyed flex">
  <h1 class="sentence variableitem">hotline</h1>
  <div class="fixeditem">
    <a href="/app/config/" onclick={move}>
      <span>設定</span>
    </a>
  </div>
</header>
<main>
  <ul class="relation_list">
    <li>
      <a href="/app/relation/" onclick={move} class="flex">
        <img src="/app/img/test.jpg" alt={name} class="thumbnail circle fixeditem">
        <div class="variableitem">
          <span class="link_text">つながる</span>
        </div>
      </a>
    </li>
    <li each={relationAry}>
      <a href="/app/relation/{relation_no}/" onclick={parent.move} class="flex">
        <img src={thumbnail} alt={name} class="thumbnail circle fixeditem">
        <div class="variableitem">
          <span class="link_text">{name}</span>
        </div>
      </a>
    </li>
  </ul>
</main>
<script>

  var relationMap = opts.schema,
      duties = opts.duties,
      key,
      that = this;

  this.relationAry = []

  relationMap.on('change', function (){
    that.update();
  });

  for (key in relationMap) {
    if (relationMap.hasOwnProperty(key)
    && 'function' !== typeof relationMap[key]) {
      this.relationAry.push(relationMap[key]);
    }
  }
  this.relationAry.sort(function (left, right) {
    return left.updateAt - right.updateAt;
  });

  move(event) {
    event.preventDefault();
    duties.transfer(event.currentTarget.pathname);
  }
</script>
<style>
  ul.relation_list > li {
    margin: 10px 0 0 10px;
  }
  .link_text {
    margin: 0 0 0 10px;
    line-height: 70px;
    vertical-align: middle;
  }
  .thumbnail {
    height: 70px;
    width: 70px;
  }
  menu {
    margin: 0 0 0 0;
    padding: 0 0 0 0;
  }
</style>
</menu>
