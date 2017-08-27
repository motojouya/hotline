<relate>
riot.tag2('div', '<span class="topback"><a href="/app" onclick="{move}">←</a></span> <h3 class="title">Hotline</h3>', '', 'class="titlebar"', function(opts) {
});
<div>
  {subscription}
<div>
riot.tag2('dl', '<virtual if="{relation}"> <dt>相手のID</dt> <dd>{relation.userid}</dd> <dt>相手の名前</dt> <dd>{relation.name}</dd> <virtual if="{relation.isApplicant}"> <dt>ステータス</dt> <dd>申請中</dd> <dt>&nbsp;</dt> <dd> <button type="button" onclick="{breakRalation}"></button>申請を取りやめる</button> </dd> </virtual> </virtual> <virtual if="{!relation}"> <dt>相手のID</dt> <dd> <input type="text" name="userid" riot-value="{userid}"> </dd> </virtual> <virtual if="{!relation || !relation.isApplicant}"> <dt>相手の合言葉</dt> <dd> <input type="text" name="countersign" riot-value="{countersign}"> </dd> <dt>&nbsp;</dt> <dd> <button type="button" onclick="{makeRalation}"></button>ホットライン申請</button> </dd> </virtual>', '', 'class="configs"', function(opts) {
});
riot.tag2('script', '', '', '', function(opts) {
  this.relation = opt.schema;
  this.duties = opt.duties;
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
    duties.transfer(event.target.a.href);
  }.bind(this)
});
riot.tag2('style', '', '', '', function(opts) {
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
});
<relate>
