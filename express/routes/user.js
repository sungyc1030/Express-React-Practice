var express = require('express');
var router = express.Router({mergeParams: true});
var User = require('../models/User');
var Certification = require('../models/Certification');
var ErrorHandler = require('../scripts/error');
var bcrypt = require('bcryptjs');
var passport = require('passport');
var jwt_decode = require('jwt-decode');
var UserClass = require('../models/UserClass');
//var db = require('../scripts/db')

/* GET users listing. */
router.get('/', passport.authenticate("jwt", {session: false}), async (req, res, next) => {
  var users = await User.query()
    .skipUndefined()
    .eager('UserClass.Class')
    .orderBy('이름')
    .catch((err) => {
      ErrorHandler(err, res);
    })
    .then(users => {
      for(var i = 0; i < users.length; i++){
        var classes = users[i].UserClass;
        if(classes.length <= 1){
          continue;
        }
        var a;
        var b;
        var temp;
        for(var j = classes.length - 1; j >= 0; j--){
          for(var k = 1; k <= j; k++){
            a = new Date(classes[k-1].Class.교육일);
            b = new Date(classes[k].Class.교육일);
            if(a.getTime() > b.getTime()){
              temp = classes[k-1];
              classes[k-1] = classes[k];
              classes[k] = temp;
            }
          }
        }
      }
      res.send(users);
    }); 

    //res.send(users);
});

router.get('/pure', passport.authenticate("jwt", {session: false}), async (req, res, next) => {
  const users = await User.query()
    .skipUndefined()
    .orderBy('이름')
    .catch((err) => {
      ErrorHandler(err, res);
    }); 
    res.send(users);
});

router.post('/', passport.authenticate("jwt", {session: false}), async (req, res, next) => {
    //Check admin status
    var bearer = req.headers.authorization;
    var token = bearer.replace('Bearer ', '');
    var decoded = jwt_decode(token);
    if(decoded.admin !== '관리자'){
      res.status(401).json(
        {
            message: '관리자 권한이 없습니다.'
        }
      );

      return;
    }
    
    var dataIn = req.body;
    var dataOut = {
      mes: "Success"
    }
    const hashCost = 10;
    const passwordHash = await bcrypt.hash(dataIn.userNo, hashCost);

    //Level logic dates
    let newIssueDate;
    let newCertificationNo;

    let levelChangeDate = null;
    let levelChangeEndDate = null;
    let today = new Date();
    if(dataIn.userLevel === 'Silver+2'){
      levelChangeDate = new Date(today.getFullYear(), 0, 1);
      levelChangeEndDate = new Date(2200, 11, 31);
    }else if(dataIn.userLevel.indexOf('Silver') !== -1){
      levelChangeDate = new Date(today.getFullYear(), 0, 1);
      levelChangeEndDate = new Date(today.getFullYear(), 11, 31);
    }else if(dataIn.userLevel == 'Gold'){
      levelChangeDate = new Date(today.getFullYear(), 0, 1);
      levelChangeEndDate = new Date(levelChangeDate.getFullYear() + 5, 11, 31);
    }else if(dataIn.userLevel == 'Normal'){
      levelChangeDate = null;
      levelChangeEndDate = null;
    }

    if(dataIn.LevelChangeDate !== '' && dataIn.userLevel != 'Normal'){
      levelChangeDate = new Date(dataIn.LevelChangeDate);
    }
    
    if(dataIn.LevelChangeDateEnd !== ''&& dataIn.userLevel != 'Normal'){
      levelChangeEndDate = new Date(dataIn.LevelChangeDateEnd);
    }

    if(dataIn.userLevel === 'Normal'){
      newIssueDate = null;
      newCertificationNo = null;
    }else if(dataIn.userLevel.indexOf('Silver') !== -1 || dataIn.userLeevl === 'Gold'){
      let counter = 0;

      const cert = await Certification.query()
        .findOne({id : 1})
        .then(c => {
          if(dataIn.userLevel.indexOf('Silver') !== -1){
            newIssueDate = (levelChangeDate.getFullYear() - 1) + '-' + 12 + '-' + 31;
            newCertificationNo = 'KCAS' + ('0000' + c.실버카운터).slice(-5) + 'S';
            counter = c.실버카운터;
          }else if(dataIn.userLevel === 'Gold'){
            newIssueDate = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
            newCertificationNo = 'KCAS' + ('0000' + c.골드카운터).slice(-5) + 'G';
            counter = c.골드카운터;
          }else if(dataIn.userLevel === 'Normal'){
            newIssueDate = null;
            newCertificationNo = null;
          }
          console.log(newCertificationNo);
        })
        .catch((err) => {
          ErrorHandler(err, res);
          console.log(err);
        });

      if(counter !== 0){
        if(dataIn.userLevel === 'Silver'){
          const cert2 = await Certification.query()
            .patch({
              실버카운터: counter + 1
            }).where({
              id: 1
            });
        }else if(dataIn.userLevel === 'Gold'){
          const cert2 = await Certification.query()
            .patch({
              골드카운터: counter + 1
            }).where({
              id: 1
            });
        }
      }
    }

    if(dataIn.IssuedDate !== '' && dataIn.userLevel != 'Normal'){
      newIssueDate = dataIn.IssuedDate;
    }
    
    if(dataIn.CertificationNumber !== '' && dataIn.userLevel != 'Normal'){
      newCertificationNo = dataIn.CertificationNumber;
      console.log(newCertificationNo);
    }
    
    const user = await User.query()
      .insert({
        유저번호: dataIn.userNo,
        이름: dataIn.userName,
        비밀번호: passwordHash,
        소속: dataIn.userAffil,
        부서: dataIn.userPart,
        직종: dataIn.userJob,
        이메일: dataIn.userEmail,
        전화번호: dataIn.userPhone,
        레벨: dataIn.userLevel,
        애드민: dataIn.userAdmin,
        로그인ID: dataIn.userNo,
        영문이름: dataIn.userEngName,
        LevelChangeDate: levelChangeDate,
        LevelChangeDateEnd: levelChangeEndDate,
        IssuedDate: newIssueDate,
        CertificationNumber: newCertificationNo,
        CEPS: dataIn.CEPS,
        CCDS: dataIn.CCDS,
      })
      .catch((err) => {
        ErrorHandler(err, res);
      });
      res.status(200).send(dataOut);
});

router.get('/:userid', passport.authenticate("jwt", {session: false}), async function(req, res, next){
  var id = req.params.userid;
  var user = await User.query()
    .where('유저ID', id)
    .eager('UserClass.Class')
    .catch((err) => {
      ErrorHandler(err, res);
    })    
    .then(users => {
      for(var i = 0; i < users.length; i++){
        var classes = users[i].UserClass;
        if(classes.length <= 1){
          continue;
        }
        var a;
        var b;
        var temp;
        for(var j = classes.length - 1; j >= 0; j--){
          for(var k = 1; k <= j; k++){
            a = new Date(classes[k-1].Class.교육일);
            b = new Date(classes[k].Class.교육일);
            if(a.getTime() > b.getTime()){
              temp = classes[k-1];
              classes[k-1] = classes[k];
              classes[k] = temp;
            }
          }
        }
      }
      /*for(var i = 0; i < users.length; i++){
        console.log(users[i].UserClass);
      }*/
      res.send(users);
    }); 

    //res.send(user);
});

router.post('/:userid', passport.authenticate("jwt", {session: false}), async function(req, res, next){
  var dataIn = req.body;
  var id = req.params.userid;
  var dataOut = {
    mes: "Success"
  }

  //Level logic dates
  let levelChangeDate = null;
  let levelChangeEndDate = null;
  let today = new Date();

  let newIssueDate;
  let newCertificationNo;

  if(dataIn.userLevel === 'Silver+2'){
    levelChangeDate = new Date(today.getFullYear(), 0, 1);
    levelChangeEndDate = new Date(2200, 11, 31);
  }else if(dataIn.userLevel.indexOf('Silver') !== -1){
    levelChangeDate = new Date(today.getFullYear(), 0, 1);
    levelChangeEndDate = new Date(today.getFullYear(), 11, 31);
  }else if(dataIn.userLevel == 'Gold'){
    levelChangeDate = new Date(today.getFullYear(), 0, 1);
    levelChangeEndDate = new Date(levelChangeDate.getFullYear() + 5, 11, 31);
  }else if(dataIn.userLevel == 'Normal'){
    levelChangeDate = null;
    levelChangeEndDate = null;
  }

  let levelChanged = false;

  //Level logic comparison
  const level = await User.query()
    .where('유저ID', id)
    .then(u => {
      if(u[0].레벨 == dataIn.userLevel){
        //전 레벨과 동일하다
        //자격에 대해서 업데이트를 할 필요는 없다
        levelChangeDate = u.LevelChangeDate;
        levelChangeEndDate = u.LevelChangeDateEnd;
      }else if(dataIn.userLevel === 'Gold' || dataIn.userLevel === 'Normal'){
        levelChanged = true;
      }else if(dataIn.userLevel.indexOf('Silver') !== -1 && u[0].레벨.indexOf('Silver') === -1){
        levelChanged = true;
      }else if(dataIn.userLevel.indexOf('Silver') === -1 && u[0].레벨.indexOf('Silver') !== -1){
        levelChanged = true;
      }

      if(dataIn.LevelChangeDate !== '' && dataIn.userLevel != 'Normal'){
        levelChangeDate = new Date(dataIn.LevelChangeDate);
      }
      
      if(dataIn.LevelChangeDateEnd !== ''&& dataIn.userLevel != 'Normal'){
        levelChangeEndDate = new Date(dataIn.LevelChangeDateEnd);
      }
    }).catch((err) => {
      ErrorHandler(err, res);
      console.log(err);
    });

  let counter = 0;
  
  if(levelChanged){
    const cert = await Certification.query()
      .findOne({id : 1})
      .then(c => {
        if(dataIn.userLevel === 'Silver'){
          newIssueDate = (levelChangeDate.getFullYear() - 1) + '-' + 12 + '-' + 31;
          newCertificationNo = 'KCAS' + ('0000' + c.실버카운터).slice(-5) + 'S';
          counter = c.실버카운터;
        }else if(dataIn.userLevel === 'Gold'){
          newIssueDate = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
          newCertificationNo = 'KCAS' + ('0000' + c.골드카운터).slice(-5) + 'G';
          counter = c.골드카운터;
        }else if(dataIn.userLevel === 'Normal'){
          newIssueDate = null;
          newCertificationNo = null;
        }
      })
      .catch((err) => {
        ErrorHandler(err, res);
        console.log(err);
      });

    if(counter !== 0){
      if(dataIn.userLevel === 'Silver'){
        const cert2 = await Certification.query()
          .patch({
            실버카운터: counter + 1
          }).where({
            id: 1
          });
      }else if(dataIn.userLevel === 'Gold'){
        const cert2 = await Certification.query()
          .patch({
            골드카운터: counter + 1
          }).where({
            id: 1
          });
      }
    }
  }else{
    newIssueDate = dataIn.IssuedDate;
    newCertificationNo = dataIn.CertificationNumber;
  }

  const user = await User.query()
    .patch({
      유저번호: dataIn.userNo,
      이름: dataIn.userName,
      소속: dataIn.userAffil,
      부서: dataIn.userPart,
      직종: dataIn.userJob,
      이메일: dataIn.userEmail,
      전화번호: dataIn.userPhone,
      레벨: dataIn.userLevel,
      애드민: dataIn.userAdmin,
      영문이름: dataIn.userEngName,
      LevelChangeDate: levelChangeDate,
      LevelChangeDateEnd: levelChangeEndDate,
      IssuedDate: newIssueDate,
      CertificationNumber: newCertificationNo,
      CEPS: dataIn.CEPS,
      CCDS: dataIn.CCDS,
    })
    .where('유저ID', id)
    .catch((err) => {
      ErrorHandler(err, res);
      console.log(err);
    }).then(() =>{
      res.send(dataOut);
    });
});

router.delete('/:userid', passport.authenticate("jwt", {session: false}), async function(req, res, next){
  //Check admin status
  var bearer = req.headers.authorization;
  var token = bearer.replace('Bearer ', '');
  var decoded = jwt_decode(token);
  if(decoded.admin !== '관리자'){
    res.status(401).json(
      {
          message: '관리자 권한이 없습니다.'
      }
    );
  
    return;
  }
  var id = req.params.userid;
  var dataOut = {
    mes: "Success"
  }
  const user = await User.query()
    .deleteById(id)
    .catch((err) => {
      ErrorHandler(err, res);
    });

  //Cascade가 안 먹히니 여기서 수동으로 삭제
  const user_class = await UserClass.query()
    .delete()
    .where('유저ID', id)
    .catch((err) => {
      ErrorHandler(err, res);
    });

  res.send(dataOut);
});

router.delete('/', passport.authenticate("jwt", {session: false}), async function(req, res, next){
  //Check admin status
  var bearer = req.headers.authorization;
  var token = bearer.replace('Bearer ', '');
  var decoded = jwt_decode(token);
  if(decoded.admin !== '관리자'){
    res.status(401).json(
      {
          message: '관리자 권한이 없습니다.'
      }
    );
  
    return;
  }
  var dataIn = req.body;
  var dataOut = {
    mes: "Success"
  }
  //Mass Delete
  const user = await User.query()
    .delete()
    .whereIn('유저ID', dataIn.ids)
    .catch((err) => {
      ErrorHandler(err, res);
    });

  //Cascade가 안 먹히니 여기서 수동으로 삭제
  const user_class = await UserClass.query()
    .delete()
    .whereIn('유저ID', dataIn.ids)
    .catch((err) => {
      ErrorHandler(err, res);
    });

  res.send(dataOut);
});

router.post('/preset/:userid', passport.authenticate("jwt", {session: false}), async function(req, res, next){
    //Check admin status
    var bearer = req.headers.authorization;
    var token = bearer.replace('Bearer ', '');
    var decoded = jwt_decode(token);
    if(decoded.admin !== '관리자'){
      res.status(401).json(
        {
            message: '관리자 권한이 없습니다.'
        }
      );
    
      return;
    }
    var id = req.params.userid;
    var dataIn = req.body;
    var dataOut = {
      mes: "Success"
    }
    const hashCost = 10;
    const passwordHash = await bcrypt.hash(dataIn.userNo.toString(), hashCost);
    const user = await User.query()
      .patch({
        비밀번호: passwordHash
      })
      .where('유저ID', id)
      .catch((err) => {
        console.log("error");
        ErrorHandler(err, res);
      });
    res.send(dataOut);
});

router.post('/pchange/:userid', passport.authenticate("jwt", {session: false}), async function(req, res, next){
  //Check admin status
  var bearer = req.headers.authorization;
  var token = bearer.replace('Bearer ', '');
  var decoded = jwt_decode(token);
  if(decoded.admin !== '관리자'){
    res.status(401).json(
      {
          message: '관리자 권한이 없습니다.'
      }
    );
  
    return;
  }
  var id = req.params.userid;
  var dataIn = req.body;
  var dataOut = {
    mes: "Success"
  };
  var dataErrOut = {
    mes: "Wrong Initial Password"
  };
  var dataErrWhat = {
    mes: "Something went wrong, I don't know what"
  };
  //Old password check
  const hashCost = 10;
  var user = await User.query()
    .where('유저ID', id)
    .first()
    .then((user) => {
      user.verifyPassword(dataIn.oldPass, async function(err, passwordCorrect){
        if (err){
          ErrorHandler(err, res);
        }
        if (!passwordCorrect){
          res.send(dataErrOut);
        }else{
          //New password update
          const newHash = await bcrypt.hash(dataIn.newPass, hashCost);
          user = await User.query()
            .where('유저ID', id)
            .first()
            .patch({
              비밀번호: newHash
            })
            .then((result) => {
              if(!result){
                res.send(dataErrWhat);
              }else{
                res.send(dataOut);
              }
            })
            .catch((err) => {
              ErrorHandler(err, res);
              return;
            });
        }
      });
    })
    .catch((err) => {
      ErrorHandler(err, res);
    });
});

module.exports = router;
