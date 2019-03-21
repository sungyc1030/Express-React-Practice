var express = require('express');
var router = express.Router({mergeParams: true});
var db = require('../scripts/db')

/* GET users listing. */
router.get('/', function(req, res, next) {
  db.connect()
  var pool = db.get()
  var sql = 'SELECT 유저.유저ID, 유저번호, 이름, 소속, 파트, 직종, 이메일, 전화번호, 레벨, 애드민, 교육.교육ID, 출결.역할, 출결.참가여부, 교육.교육명, 교육.교육일, 교육.CAS, 교육.ARC ' +  
    'FROM 유저 LEFT JOIN (출결 INNER JOIN 교육 ON 출결.교육ID = 교육.교육ID) ON 유저.유저ID = 출결.유저ID ORDER BY 유저.유저ID'
  pool.query(sql, function(err,results,fields){
    var data = [];
    var user = {};
    var userId = 0;
    var ed = {}
    var empty = {'length': 0};
    if(results === undefined){
      res.send(empty);
    }else{
      for (var i = 0; i < results.length; i++){
        if(i === 0){
          user = {
            '유저ID': results[i].유저ID,
            '유저번호': results[i].유저번호,
            '이름': results[i].이름,
            '소속': results[i].소속,
            '파트': results[i].파트,
            '직종': results[i].직종,
            '이메일': results[i].이메일,
            '전화번호': results[i].전화번호,
            '레벨': results[i].레벨,
            '권한': results[i].애드민,
            '교육': []
          };
          userId = results[i].유저ID;

          if(results[i].교육ID !== null){
            ed = {
              '교육ID': results[i].교육ID,
              '역할': results[i].역할,
              '참가여부': results[i].참가여부,
              '교육명': results[i].교육명,
              '교육일': results[i].교육일,
              'CAS': results[i].CAS,
              'ARC': results[i].ARC
            }
            user.교육.push(ed);
          }
        }else if(userId !== results[i].유저ID && i !== results.length - 1){
          data.push(user);

          user = {
            '유저ID': results[i].유저ID,
            '유저번호': results[i].유저번호,
            '이름': results[i].이름,
            '소속': results[i].소속,
            '파트': results[i].파트,
            '직종': results[i].직종,
            '이메일': results[i].이메일,
            '전화번호': results[i].전화번호,
            '레벨': results[i].레벨,
            '권한': results[i].애드민,
            '교육': []
          }
          userId = results[i].유저ID;

          if(results[i].교육ID !== null){
            ed = {
              '교육ID': results[i].교육ID,
              '역할': results[i].역할,
              '참가여부': results[i].참가여부,
              '교육명': results[i].교육명,
              '교육일': results[i].교육일,
              'CAS': results[i].CAS,
              'ARC': results[i].ARC
            }
            user.교육.push(ed);
          }
        }else if(userId !== results[i].유저ID && i === results.length - 1){
          data.push(user);

          user = {
            '유저ID': results[i].유저ID,
            '유저번호': results[i].유저번호,
            '이름': results[i].이름,
            '소속': results[i].소속,
            '파트': results[i].파트,
            '직종': results[i].직종,
            '이메일': results[i].이메일,
            '전화번호': results[i].전화번호,
            '레벨': results[i].레벨,
            '권한': results[i].애드민,
            '교육': []
          }
          userId = results[i].유저ID;

          if(results[i].교육ID !== null){
            ed = {
              '교육ID': results[i].교육ID,
              '역할': results[i].역할,
              '참가여부': results[i].참가여부,
              '교육명': results[i].교육명,
              '교육일': results[i].교육일,
              'CAS': results[i].CAS,
              'ARC': results[i].ARC
            }
            user.교육.push(ed);
          }

          data.push(user);
        }else if(i === results.length - 1){
          if(results[i].교육ID !== null){
            ed = {
              '교육ID': results[i].교육ID,
              '역할': results[i].역할,
              '참가여부': results[i].참가여부,
              '교육명': results[i].교육명,
              '교육일': results[i].교육일,
              'CAS': results[i].CAS,
              'ARC': results[i].ARC
            }
            user.교육.push(ed);
          }

          data.push(user);
        }else{
          if(results[i].교육ID !== null){
            ed = {
              '교육ID': results[i].교육ID,
              '역할': results[i].역할,
              '참가여부': results[i].참가여부,
              '교육명': results[i].교육명,
              '교육일': results[i].교육일,
              'CAS': results[i].CAS,
              'ARC': results[i].ARC
            }
            user.교육.push(ed);
          }
        }
      }
      res.send(data);
    }
  });
});

router.post('/', function(req, res, next){
  var dataIn = req.body;
  var dataOut = {}
  //Check request 
  if(dataIn === undefined){
    dataOut = {
      mes: "No Data Received"
    }
    res.send(dataOut);
  }else if(dataIn.userName === '' && Number(dataIn.userNo) <= 0){
    dataOut = {
      mes: "Data missing critical information"
    }
    res.send(dataOut);
  }else{
    db.connect();
    var pool = db.get();
    var sql = "INSERT INTO 유저 (이름, 유저번호, 비밀번호, 소속, 파트, 직종, 이메일, 전화번호, 레벨, 애드민) VALUES (" +
      "'" + dataIn.userName + "'," +
      Number(dataIn.userNo) + "," +
      "'1234'," +
      "'" + dataIn.userAffil + "'," +
      "'" + dataIn.userPart + "'," +
      "'" + dataIn.userJob + "'," +
      "'" + dataIn.userEmail + "'," +
      "'" + dataIn.userPhone + "'," +
      "'" + dataIn.userLevel + "'," +
      "'" + dataIn.userAdmin + "')";
    pool.query(sql, function(err,result,fields){
      if(err){
        dataOut = {
          mes: "Failed"
        }
        res.send(dataOut);
      }else{
        dataOut = {
          mes: "Success"
        }
        res.send(dataOut);
      }
    });
  }
});

router.get('/:userid', function(req, res, next){
  res.send('test');
});

router.post('/:userid', function(req, res, next){
  var dataIn = req.body;
  var dataOut = {}
  var id = req.params.userid;
  if (isNaN(id)){
    dataOut = {
      mes: "ID should be number"
    }
    res.send(dataOut);
  }else{
    db.connect();
    var pool = db.get();
    var sql = "UPDATE 유저 SET 이름 = '" + dataIn.userName + "', " +
      "유저번호 = " + Number(dataIn.userNo) + ", " +
      "소속 = '" + dataIn.userAffil + "', " +
      "파트 = '" + dataIn.userPart + "', " +
      "직종 = '" + dataIn.userJob + "', " +
      "이메일 = '" + dataIn.userEmail + "', " +
      "전화번호 = '" + dataIn.userPhone + "', " +
      "레벨 = '" + dataIn.userLevel + "', " +
      "애드민 = '" + dataIn.userAdmin + "' WHERE 유저ID = " + id
    pool.query(sql, function(err,result,fields){
      if(err){
        dataOut = {
          mes: "Failed"
        }
        res.send(dataOut);
      }else{
        dataOut = {
          mes: "Success"
        }
        res.send(dataOut);
      }
    });
  }
});

router.delete('/:userid', function(req, res, next){
  var id = req.params.userid;
  var dataOut = {}
  if (isNaN(id)){
    dataOut = {
      mes: "ID should be number"
    }
    res.send(dataOut);
    return;
  }else{
    db.connect();
    var pool = db.get();
    var sql = "DELETE FROM 유저 WHERE 유저ID = " + id;
    pool.query(sql, function(err, result, fields){
      if(err){
        dataOut = {
          mes: "Failed"
        }
        res.send(dataOut);
      }else{
        dataOut = {
          mes: "Success"
        }
        res.send(dataOut);
      }
    });
  }
});

module.exports = router;
