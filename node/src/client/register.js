import agent from 'superagent';

window.addEventListner('DOMContentLoaded', function (event) {

  var checkExecuter,
      useridEle = document.getElementById('userid'),
      registerExeBtn = document.getElementById('register_execute'),
      checkMsg = document.getElementById('check_message');

  var checkUserid = function () {
    agent.get('/api/v1/checkuserid')
      .query({userid: useridEle.value})
      .end(function (err, res) {
        if (err) {
          alert('通信環境のいい場所で、再度お試しください');
        }
        if (res.body.exists) {
          checkMsg.text = '入力されたユーザIDはすでに使用されています\r他のユーザIDに変更してください。';
          registerExeBtn.disabled = true;
        } else {
          checkMsg.value = '入力されたユーザIDはご利用いただけます。';
          registerExeBtn.disabled = false;
        }
      });
  };

  useridEle.addEventListner('onchange', function (event) {
    if (checkExecuter) {
      clearTimeout(checkExecuter);
    }
    checkExecuter = setTimeout(checkUserid, 1000);
  });

  registerExeBtn.addEventListner('onclick', function (event) {

    var userid = useridEle.value,
        email = document.getElementById('email'),
        countersign = document.getElementById('countersign'),
        loginpassword = document.getElementById('password'),
        password_again = document.getElementById('password_again');

    if (!userid || !email || !countersign || !password || !password_again) {
      alert('すべての項目に値を入力してください');
      return;
    }
    if (password !== password_again) {
      alert('パスワードは同じものを入力してください');
      return;
    }

    agent.post('/api/v1/register')
      .send({
        userid: userid
       ,email: email
       ,countersign: countersign
       ,loginpassword: loginpassword
       ,password_again: againpassword
      }).end(function (err, res) {
        var registerForm;
        if (err) {
          alert('通信環境のいい場所で、再度お試しください');
        }
        if (res.body.success) {
          checkMsg.text = 'ユーザ登録に失敗しました。\r時間をおいて、再度お試しください。';
        } else {
          checkMsg.text = 'ユーザを登録しました。メールが届いたら、URLから再度ログインを行ってください。\rメールからログイン後、ご利用いただけます。';
          registerForm = document.getElementById('register_form');
          registerForm.parentNode.removeChild(registerForm);
        }
      });
  });
});
