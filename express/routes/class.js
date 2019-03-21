var express = require('express');
var router = express.Router({mergeParams: true});
var db = require('../scripts/db')

router.get('/', function(req, res, next){
    db.connect()
    var pool = db.get()
    var sql = 'SELECT 교육.교육ID, 출결.역할, 출결.참가여부, 교육.교육명, 교육.교육일, 교육.CAS, 교육.ARC, 유저.유저ID, 유저번호, 이름, 소속, 파트, 직종, 이메일, 전화번호, 레벨, 애드민 ' +  
      'FROM 교육 LEFT JOIN (출결 INNER JOIN 유저 ON 출결.유저ID = 유저.유저ID) ON 교육.교육ID = 출결.교육ID ORDER BY 교육.교육ID'
    pool.query(sql, function(err,results,fields){
        var data = [];
        var classID = 0;
        var ed = {};
        var user = {};
        var empty = {'length': 0};
        if(results === undefined){
          res.send(empty);
        }else{
            for(var i = 0; i < results.length; i++){
                if(i === 0){
                    ed = {
                        '유저': [],
                        '교육ID': results[i].교육ID,
                        '교육명': results[i].교육명,
                        '교육일': results[i].교육일,
                        'CAS': results[i].CAS,
                        'ARC': results[i].ARC
                    };
                    classID = results[i].교육ID

                    if(results[i].유저ID !== null){
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
                            '역할': results[i].역할,
                            '참가여부': results[i].참가여부
                        }
                        ed.유저.push(user);
                    }
                }else if(classID !== results[i].교육ID && i !== results.length - 1){
                    data.push(ed);

                    ed = {
                        '유저': [],
                        '교육ID': results[i].교육ID,
                        '교육명': results[i].교육명,
                        '교육일': results[i].교육일,
                        'CAS': results[i].CAS,
                        'ARC': results[i].ARC
                    };
                    classID = results[i].교육ID

                    if(results[i].유저ID !== null){
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
                            '역할': results[i].역할,
                            '참가여부': results[i].참가여부
                        }
                        ed.유저.push(user);
                    }
                }else if(classID !== results[i].교육ID && i === results.length - 1){
                    data.push(ed);

                    ed = {
                        '유저': [],
                        '교육ID': results[i].교육ID,
                        '교육명': results[i].교육명,
                        '교육일': results[i].교육일,
                        'CAS': results[i].CAS,
                        'ARC': results[i].ARC
                    };
                    classID = results[i].교육ID

                    if(results[i].유저ID !== null){
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
                            '역할': results[i].역할,
                            '참가여부': results[i].참가여부
                        }
                        ed.유저.push(user);
                    }

                    data.push(ed);
                }else if(i === results.length - 1){
                    if(results[i].유저ID !== null){
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
                            '역할': results[i].역할,
                            '참가여부': results[i].참가여부
                        }
                        ed.유저.push(user);
                    }
            
                    data.push(ed);
                }else{
                    if(results[i].유저ID !== null){
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
                            '역할': results[i].역할,
                            '참가여부': results[i].참가여부
                        }
                        ed.유저.push(user);
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
    }else if(dataIn.className === ''){
      dataOut = {
        mes: "Data missing critical information"
      }
      res.send(dataOut);
    }else{
      db.connect();
      var pool = db.get();
      var sql = "INSERT INTO 교육 (교육명, 교육일, CAS, ARC) VALUES (" +
        "'" + dataIn.className + "'," +
        "'" + dataIn.classDate + "'," +
        dataIn.classCAS + "," +
        dataIn.classARC + ")"
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

router.get('/:classid', function(req, res, next){
    
});

router.post('/:classid', function(req, res, next){
    var dataIn = req.body;
    var dataOut = {}
    var id = req.params.classid;
    if (isNaN(id)){
      dataOut = {
        mes: "ID should be number"
      }
      res.send(dataOut);
    }else{
      db.connect();
      var pool = db.get();
      var sql = "UPDATE 교육 SET 교육명 = '" + dataIn.className + "', " +
        "교육일 = '" + dataIn.classDate + "', " +
        "CAS = " + dataIn.classCAS + ", " +
        "ARC = " + dataIn.classARC + " WHERE 교육ID = " + id
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

router.delete('/:classid', function(req, res, next){
    var id = req.params.classid;
    var dataOut = {}
    if (isNaN(id)){
      dataOut = {
        mes: "ID should be number"
      }
      res.send(dataOut);
    }else{
        db.connect();
        var pool = db.get();
        var sql = "DELETE FROM 교육 WHERE 교육ID = " + id;
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

module.exports = router