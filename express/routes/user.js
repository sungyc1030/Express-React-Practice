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
  });
});

router.post('/', function(req, res, next){
  console.log(req.body);
  res.send('I received your POST request. This is what you sent me: ' + req.body.post);
});

router.get('/:userid(\d+)', function(req, res, next){

});

router.post('/:userid(\d+)', function(req, res, next){

});

router.delete('/:userid(\d+)', function(req, res, next){
  
});

module.exports = router;
