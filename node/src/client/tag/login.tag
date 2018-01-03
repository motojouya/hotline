<login>
<header class="invert buoyed flex">
  <h1 class="sentence variableitem">hotline</h1>
</header>
<main>
  <dl class="def">
    <dd if={errMsg}>
      <span>ユーザIDもしくはパスワードが違います</span>
    </dd>
    <dt class="flex">
      <div class="term fixeditem">ユーザID</div>
      <div class="above_line variableitem"></div>
      <div class="edit fixeditem"></div>
    </dt>
    <dd>
      <div class="text_wrap">
        <input type="text" class="modal_input" ref="userid" />
      </div>
    </dd>
    <dt class="flex">
      <div class="term fixeditem">PASSWORD</div>
      <div class="above_line variableitem"></div>
      <div class="edit fixeditem"></div>
    </dt>
    <dd>
      <div class="text_wrap">
        <input type="password" class="modal_input" ref="password">
      </div>
    </dd>
    <dd>
      <button type="button" onclick={login}>ログイン</button>
    </dd>
  </dl>
</main>
<script>
  var duties = opts.duties,
      onetimePassword = opts.schema;
  this.errMsg = false;

  login(event) {

    var userid = this.refs.userid.value,
        password = this.refs.password.value;

    event.preventDefault();
    duties.login(userid, password, onetimePassword, function (result) {
      if (result.login) {
        duties.transfer(result.config);
      } else {
        this.errMsg = true;
      }
    });
  }
</script>
<style>
  login {
    margin: 0 0 0 0;
    padding: 0 0 0 0;
  }
</style>
</login>
