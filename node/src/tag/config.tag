<config>
<div class="titlebar">
  <span class="topback"><a href="/app" onclick={move}>←</a></span>
  <h3 class="title">Hotline</h3>
</div>
<dl class="configs">
  <dt>名前</dt>
  <dd>
    {configs.name}
    <button type="button" onchange={changeName} >変更</button>
  </dd>
  <dt>メールアドレス</dt>
  <dd>
    {configs.email}
    <button type="button" onchange={changeEmail} >変更</button>
  </dd>
  <dt>サムネイル画像</dt>
  <dd>
    <div class="thumbnail_wrap">
      <image src={configs.thumbnail} alt="thumbnail image" />
    </div>
    <input type="file" class="thumbnail" onchange={changeThumbnail}/>
  </dd>
  <dt>ログインパスワード</dt>
  <dd>
    <button type="button" onchange={changeLoginPassword} >変更</button>
  </dd>
  <dt>合言葉</dt>
  <dd>
    {configs.countersign}
    <button type="button" onchange={changeCountersign} >変更</button>
  </dd>
  <dt>テーマカラー</dt>
  <dd>
    <input type="range" style="background-color:{themeColor}" value={configs.color} max="63" onchange={changeColor}/>
  </dd>
  <dt>通知</dt>
  <dd>
    <label for="notification_none" >
      <input type="radio" value="0" name="notification" onchange={changeNotification} id="notification_none" />
      通知しない
    </label>
    <label for="notification_first" >
      <input type="radio" value="1" name="notification" onchange={changeNotification} id="notification_first" />
      最初の1回のみ
    </label>
    <label for="notification_always" >
      <input type="radio" value="2" name="notification" onchange={changeNotification} id="notification_always" />
      常に通知
    </label>
  </dd>
</dl>
<div class="hidden_popup">
  <input type="text" />
</div>
<script>
  this.configs = opts.schema;
  this.duties = opts.duties;
  this.reserveChangeConfig = {};

  var history = window.history;
  var themeColor;
  var serializeColor = function (colorNumber) {
    return '333';
  };
  var deserializeColor = function (rgbCode) {
    return 20;
  };

  changeColor(event) {
    var reservation = reserveChangeConfig['color']
      , colorNumber = event.target.value
      , themeColor = utils.serializeColor(colorNumber);

    if (reservation) {
      canselTimeout(reservation);
    }
    setTimeout(function () {
      duties.changeConfig({colorNumber: colorNumber});
    }, 1000);
  }

  changeThumbnail(event) {
    var reservation = reserveChangeConfig['thumbnail']
      , thumbnail = event.target.file;
    if (reservation) {
      canselTimeout(reservation);
    }
    setTimeout(function () {
      duties.configThumbnail(thumbnail);
    }, 1000);
  }

  changeName(event) {
    var name = prompt('名前を入力してください', '');
    if (!name) {
      alert('名前を入力してください。');
      return;
    }
    duties.changeConfig({name: name});
  }

  changeEmail(event) {
    var email = prompt('メールアドレスを入力してください', '');
    if (!email) {
      alert('メールアドレスを入力してください。');
      return;
    }
    duties.changeConfig({email: email});
  }

  changeNotification(event) {
    var reservation = reserveChangeConfig['notification']
      , notification = event.target.value;
    if (reservation) {
      canselTimeout(reservation);
    }
    setTimeout(function () {
      duties.changeConfig({notification: notification});
    }, 1000);
  }

  changeLoginPassword(event) {
    var oldPassword = prompt('現在のパスワードを入力してください', '');
    if (!oldPassword) {
      alert('パスワードを入力してください。');
      return;
    }
    var newPassword = prompt('パスワードを入力してください', '');
    if (!newPassword) {
      alert('パスワードを入力してください。');
      return;
    }
    duties.configLoginPassword(oldPassword, newPassword);
  }

  changeCountersign(event) {
    var countersign = prompt('合言葉を入力してください', '');
    if (!countersign) {
      alert('パスワードを入力してください。');
      return;
    }
    duties.changeConfig({countersign: countersign});
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
</style>
</config>
