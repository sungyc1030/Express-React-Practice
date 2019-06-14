var express = require('express');
var router = express.Router({mergeParams: true});
var Config = require('../models/Config');
var ErrorHandler = require('../scripts/error');
var bcrypt = require('bcryptjs');
var passport = require('passport');
var jwt_decode = require('jwt-decode');
var User = require('../models/User');
var Ed = require('../models/Class');
var UserClass = require('../models/UserClass');

router.get('/', passport.authenticate("jwt", {session: false}), async (req, res, next) => {
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

    const config = await Config.query()
      .skipUndefined()
      .first()
      .catch((err) => {
        ErrorHandler(err, res);
      }); 
    res.send(config);
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
    const config = await Config.query()
        .patch({
            기술인회: dataIn.tech,
            학회: dataIn.ed
        })
        .catch((err) => {
            ErrorHandler(err, res);
        }); 
    res.send(dataOut);
});

router.post('/csv', passport.authenticate("jwt", {session: false}), async(req, res, next) => {
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
    var dataIn = req.body.data;
    var dataArr = dataIn.data;
    var dataOut = {
      mes: "Success"
    }
    /*user = await User.query().findOne({
      이름: '관리자'
    });*/

    router.processCSV(dataArr,res).then(ob =>{
      console.log(ob);
      dataOut.result = ob;
      res.send(dataOut);
    }).catch(err => {
      console.log(err);
    });
});

router.processCSV = async(dataArr, res) => {
  var newuser = 0;
  var newclass = 0;
  var newuserclass = 0;
  for(var i = 0; i < dataArr.length; i++){
    let rowdata = dataArr[i]

    if(rowdata.이름 == ""){
      continue;
    }else if(!rowdata.hasOwnProperty('면허번호')){
      continue;
    }

    //check user
    let user = await User.query().findOne({
      이름: rowdata.이름,
      유저번호: rowdata.면허번호
    }).catch((err) => {
      ErrorHandler(err, res);
    });

    let userId;
    if(user == null){
      //Create new user
      let hashCost = 10;
      let passwordHash = await bcrypt.hash(rowdata.면허번호, hashCost);
      user = await User.query().insert({
        유저번호: rowdata.면허번호,
        이름: rowdata.이름,
        비밀번호: passwordHash,
        소속: rowdata.소속,
        부서: rowdata.직종,
        직종: rowdata.직종,
        이메일: rowdata.이메일,
        전화번호: rowdata.핸드폰번호,
        로그인ID: rowdata.직종 + rowdata.면허번호
      })
      .catch((err) => {
        ErrorHandler(err, res);
      });
      newuser++;
      userId = user.유저ID;
    }else{
      //Grab user ID
      userId = user.유저ID;
    }

    //check class
    let ed = await Ed.query().findOne({
      교육명: rowdata.교육명,
      교육일: rowdata.교육일자
    }).catch((err) => {
      ErrorHandler(err, res);
    });
    
    let edId;
    if(ed == null){
      ed = await Ed.query().insert({
        교육명: rowdata.교육명,
        교육일: rowdata.교육일자
      })
      .catch((err) => {
        ErrorHandler(err, res);
      });
      newclass++;
      edId = ed.교육ID;
    }else{
      //Grab class ID
      edId = ed.교육ID;
    }

    //Check Userclass
    let userclass = await UserClass.query().findOne({
      교육ID: edId,
      유저ID: userId
    }).catch((err) => {
      ErrorHandler(err, res);
    });

    if(userclass == null){
      userclass = await UserClass.query().insert({
        유저ID: userId,
        교육ID: edId,
        역할: rowdata.역할,
        참가여부: rowdata.교육참석,
        KAPA: (rowdata.KAPA === '참석' ? '인정':'불인정'),
        ARC: (rowdata.ARC인증 === '참석' ? '인정':'불인정')
      })
      .catch((err) => {
        ErrorHandler(err, res);
      });
      newuserclass++;
    }
  }
  var resultObj = {
    newuser: newuser,
    newclass: newclass,
    newuserclass: newuserclass
  }
  return resultObj
}

module.exports = router;