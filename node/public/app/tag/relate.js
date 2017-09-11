riot.tag2('relate', '<div class="titlebar"> <span class="topback"><a href="/app/" onclick="{move}">←</a></span> <h3 class="title">Hotline</h3> </div> <div> {subscription} <div> <dl class="configs"> <virtual if="{relation}"> <dt>相手のID</dt> <dd>{relation.userid}</dd> <dt>相手の名前</dt> <dd>{relation.name}</dd> <dt>ステータス</dt> <dd>申請中</dd> <dt>&nbsp;</dt> <dd> <button type="button" onclick="{breakRalation}">申請削除</button> </dd> </virtual> <virtual if="{!relation}"> <dt>相手のID</dt> <dd> <input ref="userid"> </dd> </virtual> <virtual if="{!relation || !relation.is_applicant}"> <dt>相手の合言葉</dt> <dd> <input ref="countersign"> </dd> <dt>&nbsp;</dt> <dd> <button type="button" onclick="{makeRalation}">ホットライン申請</button> </dd> </virtual> </dl>', 'relate .titlebar,[data-is="relate"] .titlebar{ } relate .title,[data-is="relate"] .title{ display: inline-block; } relate .topback,[data-is="relate"] .topback{ } relate .configs,[data-is="relate"] .configs{ list-style: none; } relate .relateduser,[data-is="relate"] .relateduser{ } relate .thumbnail_wrap,[data-is="relate"] .thumbnail_wrap{ background-image: (default_thumbnail.png); z-index: 1; } relate .thumbnail_wrap image,[data-is="relate"] .thumbnail_wrap image{ z-index: 10; } relate .thumbnail,[data-is="relate"] .thumbnail{ }', '', function(opts) {

  var duties = opts.duties;

  this.relation = opts.schema;

  this.makeRalation = function(event) {

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
  }.bind(this)

  this.breakRalation = function(event) {
    if (!confirm('ホットラインを解消してもよいですか？')) {
      return;
    }
    duties.breakRelation(this.relation.userid);
  }.bind(this)

  this.move = function(event) {
    event.preventDefault();
    duties.transfer(event.target.pathname);
  }.bind(this)
});
