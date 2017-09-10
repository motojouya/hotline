<relate>
<div class="titlebar">
  <span class="topback"><a href="/app/" onclick={move}>←</a></span>
  <h3 class="title">Hotline</h3>
</div>
<div>
  {subscription}
<div>
<dl class="configs">
  <virtual if={relation}>
    <dt>相手のID</dt>
    <dd>{relation.userid}</dd>
    <dt>相手の名前</dt>
    <dd>{relation.name}</dd>
    <virtual if={relation.isApplicant}>
      <dt>ステータス</dt>
      <dd>申請中</dd>
      <dt>&nbsp;</dt>
      <dd>
        <button type="button" onclick={breakRalation} />申請を取りやめる</button>
      </dd>
    </virtual>
  </virtual>
  <virtual if={!relation}>
    <dt>相手のID</dt>
    <dd>
      <input ref="userid" />
    </dd>
  </virtual>
  <virtual if={!relation || !relation.isApplicant}>
    <dt>相手の合言葉</dt>
    <dd>
      <input ref="countersign" />
    </dd>
    <dt>&nbsp;</dt>
    <dd>
      <button type="button" onclick={makeRalation} >ホットライン申請</button>
    </dd>
  </virtual>
</dl>
<script>

  var duties = opts.duties;

  this.relation = opts.schema;

  makeRalation(event) {

    var userid,
        countersign = this.refs.userid.value;

    if (relation) {
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
    duties.transfer(event.target.pathname);
  }
</script>
<style>
  .titlebar {
  }
  .title {
    display: inline-block;
  }
  .topback {
  }
  .configs {
    list-style: none;
  }
  .relateduser {
  }
  .thumbnail_wrap {
    background-image: (default_thumbnail.png);
    z-index: 1;
  }
  .thumbnail_wrap image {
    z-index: 10;
  }
  .thumbnail {
  }
</style>
</relate>
