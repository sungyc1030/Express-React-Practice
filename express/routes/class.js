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
                        '권한': results[i].애드민
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
                        '권한': results[i].애드민
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
                        '권한': results[i].애드민
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
                        '권한': results[i].애드민
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
                        '권한': results[i].애드민
                    }
                    ed.유저.push(user);
                }
            }
        }
        res.send(data);
    });
});

router.post('/', function(req, res, next){
    
});

router.get('/:classid(\d+)', function(req, res, next){
    
});

router.post('/:classid(\d+)', function(req, res, next){
    
});

router.delete('/:classid(\d+)', function(req, res, next){
    
});

module.exports = router