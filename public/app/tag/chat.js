riot.tag2('chat', '<div class="titlebar"> <div> <span class="topback"><a href="/app" onclick="{move}">←</a></span> <div class="thumbnail_wrap"> <image riot-src="{relateduser.thumbnail}" alt="サムネイル画像"></image> </div> <h3 class="username">{relateduser.name}</h3> <span class="configlink"><button type="button" onclick="{openOptions}">*</button></span> </div> <div show="{options}"> <input type="file" onclick="{uploadFile}">ファイル</input> <button type="button" onclick="{breakRelation}">さよなら</button> </div> </div> <ul class="voicelist"> <li class="relateduser" each="{voices}"> <span class="{utils.isSelf(parent.relateduser.userid, userid): self}">{message}<span> </li> <li class="relateduser" each="{pendingVoices}"> <span class="{utils.isSelf(parent.relateduser.userid, userid): self}">{message}<span> </li> </ul> <div> <textarea onkeyup="{speak}" onchange="{speak}">{message}</textarea> </div>', 'chat .titlebar,[data-is="chat"] .titlebar{ } chat .title,[data-is="chat"] .title{ display: inline-block; } chat .configlink,[data-is="chat"] .configlink{ } chat .userlist,[data-is="chat"] .userlist{ list-style: none; } chat .relateduser,[data-is="chat"] .relateduser{ } chat .self,[data-is="chat"] .self{ }', '', function(opts) {
  this.schema = opts.schema;
  this.duties = opts.duties;
  this.relation = schema.relation;
  this.voices = schema.voices;
  this.pendingVoices = [];
  this.message;

  voices.on('change', function (){
    this.update();
  });

  var options = false;

  this.speak = function(event) {

    var key = event.key
      , messageLines = event.target.value.split(/\r\n|\r|\n/)
      , i = 0
      , len = messageLines.length;

    event.preventDefault();
    if (len > 1) {
      for (; i < len - 1; i++) {
        duties.sendMessage(messageLines[i], true);
        pendingVoices.push(message);
      }
      message = messageLines[len - 1];
    }
    if (key === 13) {
      duties.sendMessage(messageLines[len - 1], true);
      pendingVoices.push(message);
      message = '';
    }
  }.bind(this)

  this.uploadFile = function(event) {

  }.bind(this)

  this.breakRalation = function(event) {
    if (!confirm('ホットラインを解消してもよいですか？')) {
      return;
    }
    duties.breakRelation(relation.userid);
  }.bind(this)

  this.openOptions = function(event) {
    options = !options;
  }.bind(this)

  this.move = function(event) {
    event.preventDefault();
    duties.transfer(event.target.pathname);
  }.bind(this)
});
