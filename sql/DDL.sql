
CREATE TABLE notification_config (
  config VARCHAR(16) NOT NULL
, description TEXT
, CONSTRAINT notification_config_pkey PRIMARY KEY (config)
);
COMMENT ON TABLE notification_config IS '通知の設定を定義するテーブル';
COMMENT ON COLUMN notification_config.config IS '設定値';
COMMENT ON COLUMN notification_config.description IS '説明';

INSERT INTO notification_config (config  ,description)
                         VALUES ('NEVER' ,'通知しない')
                              , ('UNLESS','未読がなければ通知、未読があれば通知しない')
                              , ('ALWAYS','常に通知する');

CREATE TABLE users (
  userid VARCHAR(16) NOT NULL
, email VARCHAR(254) NOT NULL
, name VARCHAR(128) NOT NULL
, countersign VARCHAR(16) NOT NULL
, active BOOLEAN NOT NULL DEFAULT FALSE
, color CHAR(3) NOT NULL
, notification INTEGER NOT NULL DEFAULT 1
, registered_at TIMESTAMP NOT NULL DEFAULT NOW()
, thumbnail INTEGER NOT NULL
, CONSTRAINT users_pkey PRIMARY KEY (id)
, CONSTRAINT thumbnail FOREIGN KEY files(no)
, CONSTRAINT notification FOREIGN KEY notification_config(config)
);
COMMENT ON TABLE users IS 'ユーザ情報テーブル';
COMMENT ON COLUMN users.userid IS 'ユーザid';
COMMENT ON COLUMN users.name IS '名前';
COMMENT ON COLUMN users.password IS 'password';
COMMENT ON COLUMN users.countersign IS 'つながる際に相手に入力させるパスワード';
COMMENT ON COLUMN users.active IS '有効なユーザであるか否か';
COMMENT ON COLUMN users.color IS '自分のテーマカラー';
COMMENT ON COLUMN users.notification IS 'メッセージを受け取った際の通知方法';
COMMENT ON COLUMN users.registered_at IS '登録日付';
COMMENT ON COLUMN users.thumbnail IS 'サムネイル';

CREATE TABLE auth (
  userid VARCHAR(16) NOT NULL
, password VARCHAR(16) NOT NULL
, onetime_password VARCHAR(16) NOT NULL
, registered_at TIMESTAMP NOT NULL DEFAULT NOW()
, CONSTRAINT auth_pkey PRIMARY KEY (userid)
, CONSTRAINT id FOREIGN KEY users(userid)
);
COMMENT ON TABLE auth IS 'ユーザ認証テーブル';
COMMENT ON COLUMN auth.userid IS 'ユーザid';
COMMENT ON COLUMN auth.password IS 'password';
COMMENT ON COLUMN auth.onetime_password IS '入会時に使用する一時的なpassword';
COMMENT ON COLUMN auth.registered_at IS '登録日';

CREATE TABLE relation_status (
  status VARCHAR(16) NOT NULL
, description TEXT
, CONSTRAINT relation_status_pkey PRIMARY KEY (status)
);
COMMENT ON TABLE relation_status IS 'つながりの状態を定義するテーブル';
COMMENT ON COLUMN relation_status.status IS 'status';
COMMENT ON COLUMN relation_status.description IS '説明';

INSERT INTO relation_status (status   ,description)
                     VALUES ('PENDING','関係を申請中')
                          , ('ACTIVE' ,'有効な関係')
                          , ('BROKEN' ,'無効な関係');

CREATE TABLE relations (
  relation_no SERIAL NOT NULL
, status INTEGER NOT NULL
, applied_at TIMESTAMP NOT NULL DEFAULT NOW()
, accepted_at TIMESTAMP NOT NULL DEFAULT NOW()
, CONSTRAINT relations_pkey PRIMARY KEY (no)
, CONSTRAINT status FOREIGN KEY relation_status(status)
);
COMMENT ON TABLE relations IS 'つながりテーブル';
COMMENT ON COLUMN relations.relation_no IS 'no';
COMMENT ON COLUMN relations.status IS 'ステータス';
COMMENT ON COLUMN relations.applied_at IS 'つながりを申請した時間';
COMMENT ON COLUMN relations.accepted_at IS 'つながりを受付た時間';

CREATE TABLE relation_user (
  relation_no SERIAL NOT NULL
, userid VARCHAR(16) NOT NULL
, is_applicant BOOLEAN
, CONSTRAINT relation_user_pkey PRIMARY KEY (relation_no, userid)
, CONSTRAINT no FOREIGN KEY relations(relation_no)
, CONSTRAINT userid FOREIGN KEY users(userid)
);
COMMENT ON TABLE relation_user IS 'つながりのユーザテーブル';
COMMENT ON COLUMN relation_user.relation_no IS 'no';
COMMENT ON COLUMN relation_user.userid IS 'そのつながりに属しているユーザID';
COMMENT ON COLUMN relation_user.is_applicant IS 'そのつながりに属しているユーザIDが申請した側か否か';

CREATE TABLE voices (
  relation_no INTEGER
, spoken_at TIMESTAMP NOT NULL DEFAULT NOW()
, userid  VARCHAR(16) NOT NULL
, sentence TEXT NOT NULL
, file_no INTEGER
, CONSTRAINT voices_pkey PRIMARY KEY (relation_no, spoken_at)
, CONSTRAINT relation_no FOREIGN KEY relations(relation_no)
, CONSTRAINT userid FOREIGN KEY users(userid)
);
COMMENT ON TABLE voices IS '発言テーブル';
COMMENT ON COLUMN voices.relation_no IS 'つながりテーブルの主キー';
COMMENT ON COLUMN voices.spoken_at IS '発言のタイミング';
COMMENT ON COLUMN voices.userid IS '発言したユーザID';
COMMENT ON COLUMN voices.sentence IS '発言内容。空文字の場合はトントンを意味する';
COMMENT ON COLUMN voices.file_no IS 'ファイルno。発言内容がある場合はnull、ファイルがある場合は、発言内容は空文字';

CREATE TABLE files (
  file_no SERIAL NOT NULL
, file
, CONSTRAINT files_pkey PRIMARY KEY (file_no)
);
COMMENT ON TABLE files IS 'ファイル管理テーブル';
COMMENT ON COLUMN files.file_no IS 'ファイルno';
COMMENT ON COLUMN files.file IS 'ファイル';

