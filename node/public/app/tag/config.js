riot.tag2('config', '<div class="titlebar"> <span class="topback"><a href="/app/" onclick="{move}">←</a></span> <h3 class="title">Hotline</h3> </div> <dl class="configs"> <dt>名前</dt> <dd> {configs.name} <button type="button" onclick="{changeName}">変更</button> </dd> <dt>メールアドレス</dt> <dd> {configs.email} <button type="button" onclick="{changeEmail}">変更</button> </dd> <dt>サムネイル画像</dt> <dd> <div class="thumbnail_wrap"> <image riot-src="{configs.thumbnail}" alt="thumbnail image"></image> </div> <input type="file" class="thumbnail" onclick="{changeThumbnail}"> </dd> <dt>ログインパスワード</dt> <dd> <button type="button" onclick="{changeLoginPassword}">変更</button> </dd> <dt>合言葉</dt> <dd> {configs.countersign} <button type="button" onclick="{changeCountersign}">変更</button> </dd> <dt>テーマカラー</dt> <dd riot-style="background-color:{themeColor}"> <input type="range" riot-value="{configs.color}" max="63" onchange="{changeColor}"> </dd> <dt>通知</dt> <dd> <label for="notification_none"> <input type="radio" value="0" name="notification" onchange="{changeNotification}" id="notification_none"> 通知しない </label> <label for="notification_first"> <input type="radio" value="1" name="notification" onchange="{changeNotification}" id="notification_first"> 最初の1回のみ </label> <label for="notification_always"> <input type="radio" value="2" name="notification" onchange="{changeNotification}" id="notification_always"> 常に通知 </label> </dd> </dl>', 'config .titlebar,[data-is="config"] .titlebar{ } config .title,[data-is="config"] .title{ display: inline-block; } config .topback,[data-is="config"] .topback{ } config .configs,[data-is="config"] .configs{ list-style: none; } config .relateduser,[data-is="config"] .relateduser{ } config .thumbnail_wrap,[data-is="config"] .thumbnail_wrap{ background-image: (default_thumbnail.png); z-index: 1; } config .thumbnail_wrap image,[data-is="config"] .thumbnail_wrap image{ z-index: 10; } config .thumbnail,[data-is="config"] .thumbnail{ }', '', function(opts) {

  var reserveChangeConfig = {},
      duties = opts.duties;

  var serializeColor = function (colorNumber) {
    return '4169e1';
  };
  var deserializeColor = function (rgbCode) {
    return 20;
  };

  this.configs = opts.schema;
  this.themeColor = '#' + serializeColor(this.configs.colorNumber);

  this.changeColor = function(event) {
    var reservation = reserveChangeConfig['color']
      , colorNumber = event.target.value;

    this.themeColor = '#' + serializeColor(colorNumber);

    if (reservation) {
      canselTimeout(reservation);
    }
    setTimeout(function () {
      duties.changeConfig({colorNumber: colorNumber});
    }, 1000);
  }.bind(this)

  this.changeThumbnail = function(event) {
    var reservation = reserveChangeConfig['thumbnail'],
        thumbnail = event.target.file;
    if (reservation) {
      canselTimeout(reservation);
    }
    setTimeout(function () {
      duties.configThumbnail(thumbnail);
    }, 1000);
  }.bind(this)

  this.changeName = function(event) {
    var name = prompt('名前を入力してください', '');
    if (!name) {
      alert('名前を入力してください。');
      return;
    }
    duties.changeConfig({name: name});
  }.bind(this)

  this.changeEmail = function(event) {
    var email = prompt('メールアドレスを入力してください', '');
    if (!email) {
      alert('メールアドレスを入力してください。');
      return;
    }
    duties.changeConfig({email: email});
  }.bind(this)

  this.changeNotification = function(event) {
    var reservation = reserveChangeConfig['notification'],
        notification = event.target.value;
    if (reservation) {
      canselTimeout(reservation);
    }
    setTimeout(function () {
      duties.changeConfig({notification: notification});
    }, 1000);
  }.bind(this)

  this.changeLoginPassword = function(event) {
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
  }.bind(this)

  this.changeCountersign = function(event) {
    var countersign = prompt('合言葉を入力してください', '');
    if (!countersign) {
      alert('パスワードを入力してください。');
      return;
    }
    duties.changeConfig({countersign: countersign});
  }.bind(this)

  this.move = function(event) {
    event.preventDefault();
    duties.transfer(event.target.pathname);
  }.bind(this)
});
