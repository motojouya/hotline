<config>
<header class="invert buoyed flex">
  <div class="fixeditem">
    <a href="/app/" onclick={move} class="top_back">
      <span class="back_button"></span>
    </a>
  </div>
  <h1 class="sentence variableitem">hotline</h1>
</header>
<main>
  <dl class="def">
    <dd>
      <div class="thumbnail_wrap">
        <image src={configs.thumbnail} class="thumbnail circle" alt="thumbnail image" />
        <label for="thumbnail_button" class="thumbnail_button">
          <span class="virtual_button edit fixeditem">編集</span>
          <input type="file" id="thumbnail_button" class="invisible" onclick={changeThumbnail} />
        </label>
      </div>
    </dd>
    <dt class="flex">
      <div class="term fixeditem">名前</div>
      <div class="above_line variableitem"></div>
      <button type="button" onclick={changeName} class="edit fixeditem">編集</button>
    </dt>
    <dd>
      <span>{configs.name}</span>
    </dd>
    <dt class="flex">
      <div class="term fixeditem">E-MAIL</div>
      <div class="above_line variableitem"></div>
      <button type="button" onclick={changeEmail} class="edit fixeditem">編集</button>
    </dt>
    <dd>
      <span>{configs.email}</span>
    </dd>
    <dt class="flex">
      <div class="term fixeditem">ユーザID</div>
      <div class="above_line variableitem"></div>
      <div class="edit fixeditem"></div>
    </dt>
    <dd>
      <span>{configs.userid}</span>
    </dd>
    <dt class="flex">
      <div class="term fixeditem">PASSWORD</div>
      <div class="above_line variableitem"></div>
      <button type="button" onclick={changeLoginPassword} class="edit fixeditem">編集</button>
    </dt>
    <dd>
      <span>********</span>
    </dd>
    <dt class="flex">
      <div class="term fixeditem">合言葉</div>
      <div class="above_line variableitem"></div>
      <button type="button" onclick={changeCountersign} class="edit fixeditem">編集</button>
    </dt>
    <dd>
      <span>{configs.countersign}</span>
    </dd>
    <dt class="flex">
      <div class="term fixeditem">COLOR</div>
      <div class="above_line variableitem"></div>
      <div class="edit fixeditem"></div>
    </dt>
    <dd>
      <input type="range" value={configs.colorNumber} max="23" onmousemove={previewColor} onchange={changeColor} style="background-color:{themeColor}" />
    </dd>
    <dt class="flex">
      <div class="term fixeditem">通知</div>
      <div class="above_line variableitem"></div>
      <div class="edit fixeditem"></div>
    </dt>
    <dd>
      <label for="notification_none" class="radio_label">
        <input type="radio" value="0" name="notification" onchange={changeNotification} id="notification_none" checked={configs.notification == 0} />
        <span class="radio_button"></span>
        通知しない
      </label>
      <label for="notification_first" class="radio_label">
        <input type="radio" value="1" name="notification" onchange={changeNotification} id="notification_first" checked={configs.notification == 1} />
        <span class="radio_button"></span>
        最初の1回のみ
      </label>
      <label for="notification_always" class="radio_label">
        <input type="radio" value="2" name="notification" onchange={changeNotification} id="notification_always" checked={configs.notification == 2} />
        <span class="radio_button"></span>
        常に通知
      </label>
    </dd>
  </dl>
  <div class="modal_bg" show={modals.inputText}>
    <div id="modal_text" class="modal_content">
      <div>{configName}を入力してください。</div>
      <div class="text_wrap">
        <input type="text" class="modal_input" ref="input_text">
      </div>
      <div>
        <button type="button" class="edit" onclick={cancel} >キャンセル</button>
        <button type="button" class="edit" onclick={change} >確認</button>
      </div>
    </div>
  </div>
  <div class="modal_bg" show={modals.inputPassword}>
    <div id="modal_password" class="modal_content">
      <div>PASSWORDを入力してください。</div>
      <div class="text_wrap">
        <input type="text" class="modal_input" ref="old_password" placeholder="現在のPASSWORD">
      </div>
      <div class="text_wrap">
        <input type="text" class="modal_input" ref="new_password" placeholder="新しいPASSWORD">
      </div>
      <div>
        <button type="button" class="edit" onclick={cancel} >キャンセル</button>
        <button type="button" class="edit" onclick={change} >確認</button>
      </div>
    </div>
  </div>
  <div class="modal_bg" show={modals.comfirmText}>
    <div id="modal_confirm_text" class="modal_content">
      <div>{configName}は「{newValue}」でよろしいですか？</div>
      <div>
        <button type="button" class="edit" onclick={cancel} >キャンセル</button>
        <button type="button" class="edit" onclick={confirm} >変更</button>
      </div>
    </div>
  </div>
  <div class="modal_bg" show={modals.comfirmPassword}>
    <div id="modal_confirm_password" class="modal_content">
      <div>PASSWORDを変更します。よろしいですか？</div>
      <div>
        <button type="button" class="edit" onclick={cancel} >キャンセル</button>
        <button type="button" class="edit" onclick={confirm} >変更</button>
      </div>
    </div>
  </div>
</main>
<script>

  var reserveChangeConfig = {},
      duties = opts.duties,
      colorNumberBase = 7,
      colorNumberRange = 8;

  var serializeColor = function (colorNumber) {

    if (isNaN(colorNumber) || colorNumber.length > 2 || colorNumber.length < 1 || colorNumber < 0 || colorNumber > 23) {
      return '4169e1';
    }

    var colorInt = parseInt(colorNumber),
        area = Math.floor(colorInt / colorNumberRange),
        value = colorInt % colorNumberRange;

    switch (area) {
    case 0:
      return colorNumberBase + '' + calcColorElement(value) + '' + calcColorElement(colorNumberRange - (1 + value));
    case 1:
      return calcColorElement(value) + '' + calcColorElement(colorNumberRange - (1 + value)) + '' + colorNumberBase;
    case 2:
      return calcColorElement(colorNumberRange - (1 + value)) + '' + colorNumberBase + '' + calcColorElement(value);
    default:
      return '4169e1';
    }
  };

  var calcColorElement = function (number) {
    switch (number) {
    case 7:
      return 'e';
    case 6:
      return 'd';
    case 5:
      return 'c';
    case 4:
      return 'b';
    case 3:
      return 'a';
    default :
      return number + colorNumberBase;
    }
  };

  var closeModals = function (modals, configName, newValue) {
    modals.inputText = false;
    modals.inputPassword = false;
    modals.comfirmText = false;
    modals.comfirmPassword = false;
    configName = null;
    newValue = null;
  };

  this.configs = opts.schema;
  this.themeColor = '#' + serializeColor(this.configs.colorNumber);
  this.configName = null;
  this.newValue = null;
  this.modals = {};
  this.modals.inputText = false;
  this.modals.inputPassword = false;
  this.modals.comfirmText = false;
  this.modals.comfirmPassword = false;

  cancel(event) {
    closeModals(this.modals, this.configName, this.newValue);
  }

  change (event) {
    closeModals(this.modals, this.configName, this.newValue);
    switch (this.configName) {
    case '名前':
    case 'E-MAIL':
    case 'ユーザID':
    case '合言葉':
      this.newValue = this.refs.input_text.value;
      this.modals.comfirmText = true;
      break;
    case 'PASSWORD':
      this.modals.comfirmPassword = true;
      break;
    }
  }

  confirm(event) {
    closeModals(this.modals, this.configName, this.newValue);
    switch (this.configName) {
    case '名前':
      duties.changeConfig({name: this.refs.input_text.value});
      break;
    case 'E-MAIL':
      duties.changeConfig({email: this.refs.input_text.value});
      break;
    case 'ユーザID':
      duties.changeConfig({userid: this.refs.input_text.value});
      break;
    case '合言葉':
      duties.changeConfig({countersign: this.refs.input_text.value});
      break;
    case 'PASSWORD':
      duties.configLoginPassword(this.refs.old_password.value, this.refs.new_password.value);
      break;
    }
  }

  previewColor(event) {
    this.themeColor = '#' + serializeColor(event.currentTarget.value);
  }

  changeColor(event) {
    var reservation = reserveChangeConfig['color']
      , colorNumber = event.currentTarget.value;

    this.themeColor = '#' + serializeColor(colorNumber);

    if (reservation) {
      canselTimeout(reservation);
    }
    setTimeout(function () {
      duties.changeConfig({colorNumber: colorNumber});
    }, 1000);
  }

  changeThumbnail(event) {
    var reservation = reserveChangeConfig['thumbnail'],
        thumbnail = event.currentTarget.file;
    if (reservation) {
      canselTimeout(reservation);
    }
    setTimeout(function () {
      duties.configThumbnail(thumbnail);
    }, 1000);
  }

  changeName(event) {
    closeModals(this.modals, this.configName, this.newValue);
    this.configName = '名前';
    this.modals.inputText = true;
    this.refs.input_text.value = this.configs.name;
  }

  changeEmail(event) {
    closeModals(this.modals, this.configName, this.newValue);
    this.configName = 'E-MAIL';
    this.modals.inputText = true;
    this.refs.input_text.value = this.configs.email;
  }

  changeNotification(event) {
    var reservation = reserveChangeConfig['notification'],
        notification = event.currentTarget.value;
    if (reservation) {
      canselTimeout(reservation);
    }
    setTimeout(function () {
      duties.changeConfig({notification: notification});
    }, 1000);
  }

  changeLoginPassword(event) {
    closeModals(this.modals, this.configName, this.newValue);
    this.configName = 'PASSWORD';
    this.modals.inputPassword = true;
    this.refs.old_password.value = '';
    this.refs.new_password.value = '';
  }

  changeCountersign(event) {
    closeModals(this.modals, this.configName, this.newValue);
    this.configName = '合言葉';
    this.modals.inputText = true;
    this.refs.input_text.value = this.configs.countersign;
  }

  move(event) {
    event.preventDefault();
    duties.transfer(event.currentTarget.pathname);
  }
</script>
<style>
  .thumbnail {
    height: 140px;
    width: 140px;
  }
  .thumbnail_wrap {
    text-align: center;
    position: relative;
    margin: auto;
    height: 150px;
    width: 180px;
  }
  .thumbnail_button {
    position: absolute;
    bottom: 0;
    right: 0;
  }
</style>
</config>
