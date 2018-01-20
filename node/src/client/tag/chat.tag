<chat>
<header class="invert buoyed flex">
  <div class="fixeditem" if={phone.state === 'WAITING'}>
    <a href="/app/" onclick={move} class="top_back">
      <span class="back_button"></span>
    </a>
  </div>
  <h1 class="name_header variableitem thumbnail_wrap">
    <image src={relation.thumbnail} alt="サムネイル画像" class="thumbnail circle" />
    <span class="relation_name">{relation.name}</span>
  </h1>
  <div class="fixeditem" if={phone.state === 'WAITING'}>
    <button type="button" onclick={openOptions}>*</button>
  </div>
</header>
<div class="optional_menu" show={options} if={phone.state === 'WAITING'}>
  <label for="file_select" class=""><!-- thumbnail_button -->
    <span class="virtual_button">ファイル</span><!-- edit fixeditem -->
    <input type="file" id="file_select" class="invisible" onclick={uploadFile} />
  </label>
  <button type="button" onclick={call} >電話</button>
  <button type="button" onclick={breakRelation} >さよなら</button>
</div>
<main class="flex fcol" if={phone.state === 'WAITING'}>
  <div class="voice_list_wrap variableitem">
    <ul class="voicelist flex fcolre">
      <li if={voices.editting && voices.editting.sentence} class="variableitem">
        <span style={'background-color:' + themeColor}>{voices.editting.sentence}</span>
      </li>
      <li each={voices} class="variableitem {self: (parent.config.userid === userid)}">
        <span style={(parent.config.userid === userid) ? '' : ('background-color:' + themeColor)}>{sentence}</span>
      </li>
    </ul>
  </div>
  <div class="fixeditem voice_input_wrap buoyed">
    <textarea class="voice_input" onkeyup={speak} onchange={speak} ref="message" ></textarea>
  </div>
</main>
<main class="flex fcol" if={phone.state !== 'WAITING'}>
  <div show={phone.state === 'SPEAKING'} >
    <video src={remoteSrc} autoplay />
    <video src={localSrc} autoplay />
  </div>
  <div class="call_state_wrap">
    <span>{phone.state}</span>
  </div>
  <div class="call_button_wrap">
    <button type="button" onclick={answer}>call</button>
    <span>&gt;&gt;&nbsp;&lt;&lt;</span>
    <button type="button" onclick={hangUp}>cancel</button>
  </div>
</main>
<script>

  var duties = opts.duties,
      schema = opts.schema,
      that = this;

  this.phone = opts.phone;
  this.relation = schema.relation;
  this.voices = schema.voices;
  this.config = schema.config;
  this.calling = false;
  this.remoteSrc = '';
  this.localSrc = '';
  this.themeColor = '#' + duties.serializeColor(this.relation.color);

  this.voices.on('change', function () {
    that.update();
  });

  this.options = false;

  var setStream = function (side, stream) {
    if (side === 'LOCAL') {
      localSrc = duties.getSrc(stream);
    } else if (side === 'REMOTE') {
      remoteSrc = duties.getSrc(stream);
    }
  };

  this.phone.onStateChange('WAITING', 'receiveRoot', function () {
    that.update();
  });
  this.phone.onStateChange('SPEAKING', 'receiveRoot', function () {
    that.update();
  });

  call(event) {
    this.phone.call(this.relation.userid, setStream);
  }

  answer(event) {
    this.phone.answer(setStream);
  }

  hangUp(event) {
    this.phone.hangUp();
  }

  speak(event) {

    var key = event.key
      , messageLines = this.refs.message.value.split(/\r\n|\r|\n/)
      , i = 0
      , lastIndex = messageLines.length - 1;

    event.preventDefault();

    for (; i < lastIndex; i++) {
      duties.sendMessage({
        sentence: messageLines[i],
        commit: true,
      });
    }
    if (key === 13) {
      duties.sendMessage({
        sentence: messageLines[lastIndex],
        commit: true,
      });
      this.refs.message.value = '';
    } else {
      duties.sendMessage({
        sentence: messageLines[lastIndex],
        commit: false,
      });
      this.refs.message.value = messageLines[lastIndex];
    }
  }

  uploadFile(event) {
    alert('TODO');
  }

  breakRelation(event) {
    if (!confirm('ホットラインを解消してもよいですか？')) {
      return;
    }
    duties.breakRelation(this.relation.relation_no);
  }

  openOptions(event) {
    this.options = !(this.options);
  }

  move(event) {
    event.preventDefault();
    duties.transfer(event.currentTarget.pathname);
  }
</script>
<style>
  .thumbnail {
    height: 30px;
    width: 30px;
  }
  .thumbnail_wrap {
    text-align: center;
    vartical-align: middle;
    height: 100%;
  }
  ul.voicelist {
    width: 100%;
  }
  ul.voicelist > li {
    display: inline-block;
  }
  .self {
    text-align: right;
  }
  chat {
    margin: 0 0 0 0;
    padding: 0 0 0 0;
  }
  .voice_list_wrap {
    position: fixed;
    bottom: 2rem;
    left: 0;
    right: 0;
  }
  .voice_input_wrap {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
  }
  .optional_menu {
    position: fixed;
    top: 40px;
    left: 0;
    right: 0;
    z-index: 1;
    background-color: dimgray;
  }
  .call_button_wrap {
    text-align: center;
    position: fixed;
    bottom: 50px;
    left: 0;
    right: 0;
  }
  .call_state_wrap {
    text-align: center;
    position: fixed;
    top: 50%;
    left: 0;
    right: 0;
  }
  /* .voice_input_wrap {
    height: 2rem;
    width: 100%;
  } */
  .voice_input {
    height: 100%;
    width: 100%;
  }
  .relation_name {
    margin-left: 5px;
    font-weight: normal;
    line-height: 2.1rem;
  }
  .name_header {
    margin: 3px 5px 3px 5px;
  }
</style>
</chat>
