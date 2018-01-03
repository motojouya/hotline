import agent from 'superagent';

window.addEventListener('DOMContentLoaded', function (event) {

  var checkExecuter,
      useridEle = document.getElementById('userid'),
      registerExeBtn = document.getElementById('register_execute'),
      checkMsg = document.getElementById('check_message');

  var checkUserid = function () {
    agent.get('/api/v1/check')
      .query({userid: useridEle.value})
      .end(function (err, res) {
        if (err) {
          alert('通信環境のいい場所で、再度お試しください');
        }
        if (res.body.exist) {
          checkMsg.innerHTML = '入力されたユーザIDはすでに使用されています<br>他のユーザIDに変更してください。';
          registerExeBtn.disabled = true;
        } else {
          checkMsg.innerHTML = '入力されたユーザIDはご利用いただけます。';
          registerExeBtn.disabled = false;
        }
      });
  };

  useridEle.addEventListener('change', function (event) {
    if (checkExecuter) {
      clearTimeout(checkExecuter);
    }
    checkExecuter = setTimeout(checkUserid, 1000);
  });

  registerExeBtn.addEventListener('click', function (event) {

    var userid = useridEle.value,
        name = document.getElementById('name').value,
        email = document.getElementById('email').value,
        countersign = document.getElementById('countersign').value,
        password = document.getElementById('password').value,
        passwordAgain = document.getElementById('password_again').value;

    if (!userid || !name || !email || !countersign || !password || !passwordAgain) {
      alert('すべての項目に値を入力してください');
      return;
    }
    if (password !== passwordAgain) {
      alert('パスワードは同じものを入力してください');
      return;
    }

    agent.post('/api/v1/register')
      .send({
        userid: userid,
        name: name,
        email: email,
        countersign: countersign,
        password: password
      }).end(function (err, res) {
        var registerForm;
        if (err) {
          alert('通信環境のいい場所で、再度お試しください');
        }
        if (res.body.register) {
          checkMsg.innerHTML = 'ユーザを登録しました。メールが届いたら、URLから再度ログインを行ってください。<br>メールからログイン後、ご利用いただけます。';
          registerForm = document.getElementById('register_form');
          registerForm.parentNode.removeChild(registerForm);
        } else {
          checkMsg.innerHTML = 'ユーザ登録に失敗しました。<br>時間をおいて、再度お試しください。';
        }
      });
  });
});
