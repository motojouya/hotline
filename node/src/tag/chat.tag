<chat>
<div class="titlebar">
  <div>
    <span class="topback"><a href="/app/" onclick={move}>←</a></span>
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
    <span class={(parent.relateduser.userid === userid): self}>{message}<span>
  </li>
  <li class="relateduser" >
    <span class={(parent.relateduser.userid === userid): self}>{pendingVoice}<span>
  </li>
</ul>
<div>
  <textarea onkeyup={speak} onchange={speak} ref="message" ></textarea>
</div>
<script>

  var duties = opts.duties,
      schema = opts.schema;

  this.relation = schema.relation;
  this.voices = schema.voices;
  this.pendingVoice = null;

  voices.on('change', function (){
    this.update();
  });

  var options = false;

  speak(event) {

    var key = event.key
      , messageLines = this.refs.message.value.split(/\r\n|\r|\n/)
      , i = 0
      , len = messageLines.length

    event.preventDefault();

    if (len > 1) {
      for (; i < len - 1; i++) {
        duties.sendMessage(messageLines[i], true);
      }
      this.refs.message.value = messageLines[len - 1];
    }
    if (key === 13) {
      duties.sendMessage(messageLines[len - 1], true);
      this.refs.message.value = '';
    } else {
      this.pendingVoice.push(messageLines[len - 1]);
    }
  }

  uploadFile(event) {
    //TODO
  }

  breakRalation(event) {
    if (!confirm('ホットラインを解消してもよいですか？')) {
      return;
    }
    duties.breakRelation(this.relation.userid);
  }

  openOptions(event) {
    options = !options;
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
</chat>
