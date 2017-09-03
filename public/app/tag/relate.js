riot.tag2('relate', '<div class="titlebar"> <span class="topback"><a href="/app" onclick="{move}">←</a></span> <h3 class="title">Hotline</h3> </div> <div> {subscription} <div> <dl class="configs"> <virtual if="{relation}"> <dt>相手のID</dt> <dd>{relation.userid}</dd> <dt>相手の名前</dt> <dd>{relation.name}</dd> <virtual if="{relation.isApplicant}"> <dt>ステータス</dt> <dd>申請中</dd> <dt>&nbsp;</dt> <dd> <button type="button" onclick="{breakRalation}"></button>申請を取りやめる</button> </dd> </virtual> </virtual> <virtual if="{!relation}"> <dt>相手のID</dt> <dd> <input type="text" name="userid" riot-value="{userid}"> </dd> </virtual> <virtual if="{!relation || !relation.isApplicant}"> <dt>相手の合言葉</dt> <dd> <input type="text" name="countersign" riot-value="{countersign}"> </dd> <dt>&nbsp;</dt> <dd> <button type="button" onclick="{makeRalation}"></button>ホットライン申請</button> </dd> </virtual> </dl>', 'relate .titlebar,[data-is="relate"] .titlebar{ } relate .title,[data-is="relate"] .title{ display: inline-block; } relate .topback,[data-is="relate"] .topback{ } relate .configs,[data-is="relate"] .configs{ list-style: none; } relate .relateduser,[data-is="relate"] .relateduser{ } relate .thumbnail_wrap,[data-is="relate"] .thumbnail_wrap{ background-image: (default_thumbnail.png); z-index: 1; } relate .thumbnail_wrap image,[data-is="relate"] .thumbnail_wrap image{ z-index: 10; } relate .thumbnail,[data-is="relate"] .thumbnail{ }', '', function(opts) {
  this.relation = opts.schema;
  this.duties = opts.duties;
  this.userid;
  this.countersign;

  this.makeRalation = function(event) {
    if (relation) {
      userid = relation.userid;
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
    duties.breakRelation(relation.userid);
  }.bind(this)

  this.move = function(event) {
    event.preventDefault();
    duties.transfer(event.target.pathname);
  }.bind(this)
});
