<chat>
<div class="titlebar">
  <div>
    <span class="topback"><a href="/app/" onclick={move}>←</a></span>
    <div class="thumbnail_wrap">
      <image src={relation.thumbnail} alt="サムネイル画像" />
    </div>
    <h3 class="username">{relation.name}</h3>
    <span class="configlink"><button type="button" onclick={openOptions}>*</button></span>
  </div>
  <div show={options} >
    <input type="file" onclick={uploadFile} >ファイル</input>
    <button type="button" onclick={breakRelation} >さよなら</button>
  </div>
</div>
<ul class="voicelist">
  <li each={voices} class="relateduser">
    <span class={(parent.relation.userid === userid): self}>{message}<span>
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

  this.voices.on('change', function (){
    this.update();
  });

  this.options = false;

  speak(event) {

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
  }

  uploadFile(event) {
    alert('TODO');
  }

  breakRalation(event) {
    if (!confirm('ホットラインを解消してもよいですか？')) {
      return;
    }
    duties.breakRelation(this.relation.userid);
  }

  openOptions(event) {
    this.options = !(this.options);
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
