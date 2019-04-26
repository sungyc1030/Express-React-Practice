var express = require('express');
var router = express.Router({mergeParams: true});
var User = require('../models/User');
var ErrorHandler = require('../scripts/error');
var bcrypt = require('bcryptjs');
var passport = require('passport');
var jwt_decode = require('jwt-decode');
//var db = require('../scripts/db')

/* GET users listing. */
router.get('/', passport.authenticate("jwt", {session: false}), async (req, res, next) => {
  const users = await User.query()
    .skipUndefined()
    .eager('UserClass.Class')
    .catch((err) => {
      ErrorHandler(err, res);
    }); 
    res.send(users);
});

router.get('/pure', passport.authenticate("jwt", {session: false}), async (req, res, next) => {
  const users = await User.query()
    .skipUndefined()
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
        파트: dataIn.userPart,
        직종: dataIn.userJob,
        이메일: dataIn.userEmail,
        전화번호: dataIn.userPhone,
        레벨: dataIn.userLevel,
        애드민: dataIn.userAdmin,
        로그인ID: dataIn.userPart + dataIn.userNo
      })
      .catch((err) => {
        ErrorHandler(err, res);
      });
      res.status(200).send(dataOut);
});

router.get('/:userid', passport.authenticate("jwt", {session: false}), async function(req, res, next){
  var id = req.params.userid;
  const user = await User.query()
    .where('유저ID', id)
    .eager('UserClass.Class')
    .catch((err) => {
      ErrorHandler(err, res);
    });
    res.send(user);
});

router.post('/:userid', passport.authenticate("jwt", {session: false}), async function(req, res, next){
  var dataIn = req.body;
  var id = req.params.userid;
  var dataOut = {
    mes: "Success"
  }
  const user = await User.query()
    .update({
      유저번호: dataIn.userNo,
      이름: dataIn.userName,
      소속: dataIn.userAffil,
      파트: dataIn.userPart,
      직종: dataIn.userJob,
      이메일: dataIn.userEmail,
      전화번호: dataIn.userPhone,
      레벨: dataIn.userLevel,
      애드민: dataIn.userAdmin
    })
    .where('유저ID', id)
    .catch((err) => {
      ErrorHandler(err, res);
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
    console.log("here");
    var id = req.params.userid;
    var dataIn = req.body;
    var dataOut = {
      mes: "Success"
    }
    const hashCost = 10;
    const passwordHash = await bcrypt.hash(dataIn.userNo.toString(), hashCost);
    console.log("there");
    const user = await User.query()
      .update({
        비밀번호: passwordHash
      })
      .where('유저ID', id)
      .catch((err) => {
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
  }
  const hashCost = 10;
  const passwordHash = await bcrypt.hash(dataIn.userNo, hashCost);
  const user = await User.query()
    .update({
      비밀번호: passwordHash
    })
    .where('유저ID', id)
    .catch((err) => {
      ErrorHandler(err, res);
    });
    res.send(dataOut);
});

module.exports = router;
