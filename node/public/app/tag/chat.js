riot.tag2('chat', '<div class="titlebar"> <div> <span class="topback"><a href="/app/" onclick="{move}">←</a></span> <div class="thumbnail_wrap"> <image riot-src="{relation.thumbnail}" alt="サムネイル画像"></image> </div> <h3 class="username">{relation.name}</h3> <span class="configlink"><button type="button" onclick="{openOptions}">*</button></span> </div> <div show="{options}"> <input type="file" onclick="{uploadFile}">ファイル</input> <button type="button" onclick="{breakRelation}">さよなら</button> </div> </div> <ul class="voicelist"> <li each="{voices}" class="relateduser"> <span class="{(parent.relation.userid === userid): self}">{message}<span> </li> </ul> <div> <textarea onkeyup="{speak}" onchange="{speak}" ref="message"></textarea> </div>', 'chat .titlebar,[data-is="chat"] .titlebar{ } chat .title,[data-is="chat"] .title{ display: inline-block; } chat .configlink,[data-is="chat"] .configlink{ } chat .userlist,[data-is="chat"] .userlist{ list-style: none; } chat .relateduser,[data-is="chat"] .relateduser{ } chat .self,[data-is="chat"] .self{ }', '', function(opts) {

  var duties = opts.duties,
      schema = opts.schema;

  this.relation = schema.relation;
  this.voices = schema.voices;

  this.voices.on('change', function (){
    this.update();
  });

  this.options = false;

  this.speak = function(event) {

    var key = event.key
      , messageLines = this.refs.message.value.split(/\r\n|\r|\n/)
      , i = 0
      , len = messageLines.length

    event.preventDefault();

    for (; i < len - 1; i++) {
      duties.sendMessage(messageLines[i], true);
    }
    if (key === 13) {
      duties.sendMessage(messageLines[len - 1], true);
      this.refs.message.value = '';
    } else {
      duties.sendMessage(messageLines[len - 1], false);
      this.refs.message.value = messageLines[len - 1];
    }
  }.bind(this)

  this.uploadFile = function(event) {
    alert('TODO');
  }.bind(this)

  this.breakRalation = function(event) {
    if (!confirm('ホットラインを解消してもよいですか？')) {
      return;
    }
    duties.breakRelation(this.relation.userid);
  }.bind(this)

  this.openOptions = function(event) {
    this.options = !(this.options);
  }.bind(this)

  this.move = function(event) {
    event.preventDefault();
    duties.transfer(event.target.pathname);
  }.bind(this)
});
