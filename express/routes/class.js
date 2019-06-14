var express = require('express');
var router = express.Router({mergeParams: true});
var Class = require('../models/Class');
var ErrorHandler = require('../scripts/error');
var passport = require('passport');
var jwt_decode = require('jwt-decode');
var UserClass = require('../models/UserClass');
//var db = require('../scripts/db')

router.get('/', passport.authenticate("jwt", {session: false}), async (req, res, next) =>{
    const classes = await Class.query()
      .skipUndefined()
      .eager('UserClass.User')
      .orderBy('교육일')
      .catch((err) => {
        ErrorHandler(err, res);
      })
      .then(classes => {
        for(var i = 0; i < classes.length; i++){
          var users = classes[i].UserClass;
          if(users.length <= 1){
            continue;
          }
          var a;
          var b;
          var temp;
          for(var j = 0; j < users.length; j++){
            a = users[j].User.이름;
            for(var k = j + 1; k < users.length; k++){
              b = users[k].User.이름;
              if(a > b){
                temp = users[j];
                users[j] = users[k];
                users[k] = temp;
              }
            }
          }
        }

        res.send(classes);
      });
    //res.send(classes);
});

router.get('/pure', passport.authenticate("jwt", {session: false}), async (req, res, next) => {
  const classes = await Class.query()
    .skipUndefined()
    .orderBy('교육일')
    .catch((err) => {
      ErrorHandler(err, res);
    });
  res.send(classes);
});

router.post('/', passport.authenticate("jwt", {session: false}), async function(req, res, next){
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
    const insertClass = await Class.query()
      .insert({
        교육명: dataIn.className,
        교육일: dataIn.classDate,
        //KAPA: dataIn.classKAPA,
        //ARC: dataIn.classARC
      })
      .catch((err) => {
        ErrorHandler(err, res);
      });
    res.send(dataOut);
});

router.get('/:classid', function(req, res, next){
    
});

router.post('/:classid', passport.authenticate("jwt", {session: false}), async function(req, res, next){
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
    var id = req.params.classid;
    var dataOut = {
      mes: "Success"
    }
    const updateClass = await Class.query()
      .patch({
        교육명: dataIn.className,
        교육일: dataIn.classDate,
        //KAPA: dataIn.classKAPA,
        //ARC: dataIn.classARC
      })
      .where('교육ID', id)
      .catch((err) => {
        ErrorHandler(err, res);
      });
    res.send(dataOut);
});

router.delete('/:classid', passport.authenticate("jwt", {session: false}), async function(req, res, next){
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
    var id = req.params.classid;
    var dataOut = {
      mes: "Success"
    }
    const delClass = await Class.query()
      .deleteById(id)
      .catch((err) => {
        ErrorHandler(err, res);
      });

    //Cascade가 안 먹히니 여기서 수동으로 삭제
    const user_class = await UserClass.query()
      .delete()
      .where('교육ID', id)
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
  const delClass = await Class.query()
    .delete()
    .whereIn('교육ID', dataIn.ids)
    .catch((err) => {
      ErrorHandler(err, res);
    });

  //Cascade가 안 먹히니 여기서 수동으로 삭제
  const user_class = await UserClass.query()
    .delete()
    .whereIn('교육ID', dataIn.ids)
    .catch((err) => {
      ErrorHandler(err, res);
    });

  res.send(dataOut);
});

module.exports = router