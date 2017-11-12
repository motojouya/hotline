<relate>
<header class="invert buoyed flex">
  <div class="fixeditem">
    <a href="/app/" onclick={move} class="top_back">
      <span class="back_button"></span>
    </a>
  </div>
  <h1 class="sentence variableitem">hotline</h1>
</header>
<main>
  <div>{subscription}<div>
  <dl class="def">
    <virtual if={relation}>
      <dt class="flex">
        <div class="term fixeditem">相手のID</div>
        <div class="above_line variableitem"></div>
        <div class="edit fixeditem"></div>
      </dt>
      <dd>
        <span>{relation.userid}</span>
      </dd>
      <dt class="flex">
        <div class="term fixeditem">相手の名前</div>
        <div class="above_line variableitem"></div>
        <div class="edit fixeditem"></div>
      </dt>
      <dd>
        <span>{relation.name}</span>
      </dd>
      <dt class="flex">
        <div class="term fixeditem">ステータス</div>
        <div class="above_line variableitem"></div>
        <div class="edit fixeditem"></div>
      </dt>
      <dd>
        <span>申請中</span>
      </dd>
    </virtual>
    <virtual if={!relation}>
      <dt class="flex">
        <div class="term fixeditem">相手のID</div>
        <div class="above_line variableitem"></div>
        <div class="edit fixeditem"></div>
      </dt>
      <dd>
        <div class="text_wrap">
          <input type="text" class="modal_input" ref="userid" />
        </div>
      </dd>
    </virtual>
    <virtual if={!relation || !relation.is_applicant}>
      <dt class="flex">
        <div class="term fixeditem">相手の合言葉</div>
        <div class="above_line variableitem"></div>
        <div class="edit fixeditem"></div>
      </dt>
      <dd>
        <div class="text_wrap">
          <input type="text" class="modal_input" ref="countersign" />
        </div>
      </dd>
    </virtual>
    <dd>
      <virtual if={relation}>
        <button type="button" onclick={breakRalation} >申請削除</button>
      </virtual>
      <virtual if={!relation || !relation.is_applicant}>
        <button type="button" onclick={makeRalation} >ホットライン申請</button>
      </virtual>
    </dd>
  </dl>
</main>
<script>

  var duties = opts.duties;

  this.relation = opts.schema;

  makeRalation(event) {

    var userid,
        countersign = this.refs.countersign.value;

    if (this.relation) {
      userid = this.relation.userid;
    } else {
      userid = this.refs.userid.value;
    }

    if (!userid || !countersign) {
      alert('ユーザIDと合言葉を入力してください');
      return;
    }
    duties.makeRelation(userid, countersign);
  }

  breakRalation(event) {
    if (!confirm('ホットラインを解消してもよいですか？')) {
      return;
    }
    duties.breakRelation(this.relation.userid);
  }

  move(event) {
    event.preventDefault();
    duties.transfer(event.currentTarget.pathname);
  }
</script>
<style>
  relate {
    margin: 0 0 0 0;
    padding: 0 0 0 0;
  }
</style>
</relate>
