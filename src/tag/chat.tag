<chat>
<div class="titlebar">
  <div>
    <span class="topback"><a href="/" onclick={parent.move}>←</a></span>
    <div class="thumbnail_wrap">
      <image src={relateduser.thumbnail} alt="サムネイル画像" />
    </div>
    <h3 class="username">{relateduser.name}</h3>
    <span class="configlink"><button type="button" onclick={openOptions}>*</button></span>
  </div>
  <div show={options} >
    <input type="file" onclick={uploadFile} >ファイル</input>
    <button type="button" onclick={breakRelation} >さよなら</button>
  </div>
</div>
<ul class="voicelist">
  <li class="relateduser" each={voices}>
    <span class={utils.isSelf(parent.relateduser.userid, userid): self}>{message}<span>
  </li>
  <li class="relateduser" each={pendingVoices}>
    <span class={utils.isSelf(parent.relateduser.userid, userid): self}>{message}<span>
  </li>
</ul>
<div>
  <textarea onkeyup={speak} onchange={speak}>{message}</textarea>
</div>
<script>
  this.schema = opt.schema;
  this.duties = opt.duties;
  this.relation = schema.relation;
  this.voices = schema.voices;
  this.pendingVoices = [];
  this.message;

  voices.on('change', function (){
    this.update();
  });

  var options = false;

  speak(event) {

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
  }

  uploadFile(event) {
    //TODO
  }

  breakRalation(event) {
    if (!confirm('ホットラインを解消してもよいですか？')) {
      return;
    }
    duties.breakRelation(relation.userid);
  }

  openOptions(event) {
    options = !options;
  }

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
  .self {
  }
</style>
<chat>
