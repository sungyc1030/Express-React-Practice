var express = require('express');
var router = express.Router({mergeParams: true});
var UserClass = require('../models/UserClass');
var ErrorHandler = require('../scripts/error');
var jwt_decode = require('jwt-decode');
var passport = require('passport');
var db = require('../scripts/db');

router.get('/', function(req, res, next){
    
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

    const user_class = await UserClass.query()
      .insert({
        유저ID: dataIn.userID,
        교육ID: dataIn.classID,
        역할: dataIn.role,
        참가여부: dataIn.attendance,
        CAS: dataIn.CAS,
        ARC: dataIn.ARC
      })
      .catch((err) => {
        ErrorHandler(err, res);
      });
      res.status(200).send(dataOut);
});

router.get('/:id', function(req, res, next){
    
});

router.post('/:id', passport.authenticate("jwt", {session: false}), async function(req, res, next){
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

    var id = req.params.id;
    var dataIn = req.body;
    var dataOut = {
        mes: "Success"
    }
    const user_class = await UserClass.query()
        .patch({
            유저ID: dataIn.userID,
            교육ID: dataIn.classID,
            역할: dataIn.role,
            참가여부: dataIn.attendance,
            CAS: dataIn.CAS,
            ARC: dataIn.ARC
        })
        .where('출결ID', id)
        .catch((err) => {
            ErrorHandler(err, res);
        });
    res.send(dataOut);
});

router.delete('/:id', passport.authenticate("jwt", {session: false}), async function(req, res, next){
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

  var id = req.params.id;
  var dataOut = {
    mes: "Success"
  }
  const user_class = await UserClass.query()
    .deleteById(id)
    .catch((err) => {
      ErrorHandler(err, res);
    });
    res.send(dataOut);
});

module.exports = router