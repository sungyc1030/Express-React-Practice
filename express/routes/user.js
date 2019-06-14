var express = require('express');
var router = express.Router({mergeParams: true});
var User = require('../models/User');
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
        for(var j = 0; j < classes.length; j++){
          a = classes[j].Class.교육일;
          for(var k = j + 1; k < classes.length; k++){
            b = classes[k].Class.교육일;
            if(a > b){
              temp = classes[j];
              classes[j] = classes[k];
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
        로그인ID: dataIn.userNo
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
        for(var j = 0; j < classes.length; j++){
          a = classes[j].Class.교육일;
          for(var k = j + 1; k < classes.length; k++){
            b = classes[k].Class.교육일;
            if(a > b){
              temp = classes[j];
              classes[j] = classes[k];
              classes[k] = temp;
            }
          }
        }
      }
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
      영문이름: dataIn.userEngName
    })
    .where('유저ID', id)
    .catch((err) => {
      ErrorHandler(err, res);
      console.log(err);
    });
    res.send(dataOut);
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
