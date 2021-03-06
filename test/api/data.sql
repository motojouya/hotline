INSERT INTO users (userid      ,email                 ,name       ,countersign,active,color,notification,registered_at,thumbnail          )
           VALUES ('testuser01','testuser01@gmail.com','試験 零一','cs01'     ,TRUE  ,    7,'UNLESS'    ,now()        ,'/app/img/test.jpg')
                , ('testuser02','testuser02@gmail.com','試験 零二','cs02'     ,TRUE  ,    7,'UNLESS'    ,now()        ,'/app/img/test.jpg')
                , ('testuser03','testuser03@gmail.com','試験 零三','cs03'     ,TRUE  ,   15,'ALWAYS'    ,now()        ,'/app/img/test.jpg')
                , ('testuser04','testuser04@gmail.com','試験 零四','cs04'     ,TRUE  ,    7,'UNLESS'    ,now()        ,'/app/img/test.jpg')
                , ('testuser05','testuser05@gmail.com','試験 零五','cs05'     ,TRUE  ,    7,'UNLESS'    ,now()        ,'/app/img/test.jpg')
                , ('testuser06','testuser06@gmail.com','試験 零六','cs06'     ,TRUE  ,    7,'UNLESS'    ,now()        ,'/app/img/test.jpg')
                , ('testuser07','testuser07@gmail.com','試験 零七','cs07'     ,TRUE  ,    7,'UNLESS'    ,now()        ,'/app/img/test.jpg')
                , ('testuser08','testuser08@gmail.com','試験 零八','cs08'     ,TRUE  ,    7,'UNLESS'    ,now()        ,'/app/img/test.jpg')
                , ('testuser09','testuser09@gmail.com','試験 零九','cs09'     ,TRUE  ,    7,'UNLESS'    ,now()        ,'/app/img/test.jpg')
                , ('testuser10','testuser10@gmail.com','試験 一零','cs10'     ,TRUE  ,    7,'UNLESS'    ,now()        ,'/app/img/test.jpg')
                , ('testuser11','testuser11@gmail.com','試験 一一','cs11'     ,TRUE  ,    7,'UNLESS'    ,now()        ,'/app/img/test.jpg')
                , ('testuser12','testuser12@gmail.com','試験 一二','cs12'     ,TRUE  ,    7,'UNLESS'    ,now()        ,'/app/img/test.jpg')
                , ('testuser13','testuser13@gmail.com','試験 一三','cs13'     ,TRUE  ,    7,'UNLESS'    ,now()        ,'/app/img/test.jpg')
                , ('testuser14','testuser14@gmail.com','試験 一四','cs14'     ,TRUE  ,    7,'UNLESS'    ,now()        ,'/app/img/test.jpg')
                , ('testuser15','testuser15@gmail.com','試験 一五','cs15'     ,TRUE  ,    7,'UNLESS'    ,now()        ,'/app/img/test.jpg')
                , ('testuser16','testuser16@gmail.com','試験 一六','cs16'     ,TRUE  ,    7,'UNLESS'    ,now()        ,'/app/img/test.jpg')
                , ('testuser17','testuser17@gmail.com','試験 一七','cs17'     ,TRUE  ,    7,'UNLESS'    ,now()        ,'/app/img/test.jpg')
                , ('testuser18','testuser18@gmail.com','試験 一八','cs18'     ,TRUE  ,    7,'UNLESS'    ,now()        ,'/app/img/test.jpg')
                , ('testuser19','testuser19@gmail.com','試験 一九','cs19'     ,TRUE  ,    7,'UNLESS'    ,now()        ,'/app/img/test.jpg');
INSERT INTO auth (userid      ,password,onetime_password,registered,registered_at)
          VALUES ('testuser01','pw01'  ,'ot01'          ,TRUE      ,now()        )
               , ('testuser02','pw02'  ,'ot02'          ,FALSE     ,now()        )
               , ('testuser03','pw03'  ,'ot03'          ,TRUE      ,now()        )
               , ('testuser04','pw04'  ,'ot04'          ,TRUE      ,now()        )
               , ('testuser05','pw05'  ,'ot05'          ,TRUE      ,now()        )
               , ('testuser06','pw06'  ,'ot06'          ,TRUE      ,now()        )
               , ('testuser07','pw07'  ,'ot07'          ,TRUE      ,now()        )
               , ('testuser08','pw08'  ,'ot08'          ,TRUE      ,now()        )
               , ('testuser09','pw09'  ,'ot09'          ,TRUE      ,now()        )
               , ('testuser10','pw10'  ,'ot10'          ,TRUE      ,now()        )
               , ('testuser11','pw11'  ,'ot11'          ,TRUE      ,now()        )
               , ('testuser12','pw12'  ,'ot12'          ,TRUE      ,now()        )
               , ('testuser13','pw13'  ,'ot13'          ,TRUE      ,now()        )
               , ('testuser14','pw14'  ,'ot14'          ,TRUE      ,now()        )
               , ('testuser15','pw15'  ,'ot15'          ,TRUE      ,now()        )
               , ('testuser16','pw16'  ,'ot16'          ,TRUE      ,now()        )
               , ('testuser17','pw17'  ,'ot17'          ,TRUE      ,now()        )
               , ('testuser18','pw18'  ,'ot18'          ,TRUE      ,now()        )
               , ('testuser19','pw19'  ,'ot19'          ,TRUE      ,now()        );
INSERT INTO relations (relation_no,status   ,applied_at,accepted_at)
               VALUES (          1,'ACTIVE' ,now()     ,now()      )
                    , (          2,'ACTIVE' ,now()     ,now()      )
                    , (          3,'ACTIVE' ,now()     ,now()      )
                    , (          4,'ACTIVE' ,now()     ,now()      )
                    , (          5,'ACTIVE' ,now()     ,now()      )
                    , (          6,'ACTIVE' ,now()     ,now()      )
                    , (          7,'ACTIVE' ,now()     ,now()      )
                    , (          8,'ACTIVE' ,now()     ,now()      )
                    , (          9,'ACTIVE' ,now()     ,now()      )
                    , (         10,'PENDING',now()     ,now()      );
INSERT INTO relation_user (relation_no,userid      ,is_applicant)
                   VALUES (          2,'testuser01',TRUE        )
                        , (          2,'testuser02',FALSE       )
                        , (          3,'testuser01',TRUE        )
                        , (          3,'testuser03',FALSE       )
                        , (          4,'testuser01',TRUE        )
                        , (          4,'testuser04',FALSE       )
                        , (          5,'testuser01',TRUE        )
                        , (          5,'testuser05',FALSE       )
                        , (          6,'testuser01',TRUE        )
                        , (          6,'testuser06',FALSE       )
                        , (          7,'testuser01',TRUE        )
                        , (          7,'testuser07',FALSE       )
                        , (          8,'testuser01',TRUE        )
                        , (          8,'testuser08',FALSE       )
                        , (          9,'testuser01',TRUE        )
                        , (          9,'testuser09',FALSE       )
                        , (         10,'testuser01',FALSE       )
                        , (         10,'testuser10',TRUE        );
INSERT INTO voices (relation_no,spoken_at                  ,userid      ,sentence)
            VALUES (          2,Timestamp'2017-12-11 12:01','testuser01','こっち')
                 , (          2,Timestamp'2017-12-11 12:02','testuser02','あっち')
                 , (          2,Timestamp'2017-12-11 12:03','testuser01','こっち')
                 , (          2,Timestamp'2017-12-11 12:04','testuser02','あっち')
                 , (          2,Timestamp'2017-12-11 12:05','testuser01','こっち')
                 , (          2,Timestamp'2017-12-11 12:06','testuser02','あっち')
                 , (          2,Timestamp'2017-12-11 12:07','testuser01','こっち')
                 , (          2,Timestamp'2017-12-11 12:08','testuser02','あっち')
                 , (          2,Timestamp'2017-12-11 12:09','testuser01','こっち')
                 , (          2,Timestamp'2017-12-11 12:10','testuser02','あっち')
                 , (          2,Timestamp'2017-12-11 12:11','testuser01','こっち')
                 , (          2,Timestamp'2017-12-11 12:12','testuser02','あっち')
                 , (          2,Timestamp'2017-12-11 12:13','testuser01','こっち')
                 , (          2,Timestamp'2017-12-11 12:14','testuser02','あっち')
                 , (          2,Timestamp'2017-12-11 12:15','testuser01','こっち');
SELECT setval('relations_relation_no_seq', 10);

