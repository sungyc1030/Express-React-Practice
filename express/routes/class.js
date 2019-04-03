var express = require('express');
var router = express.Router({mergeParams: true});
var Class = require('../models/Class');
var ErrorHandler = require('../scripts/error');
var passport = require('passport');
var jwt_decode = require('jwt-decode');
//var db = require('../scripts/db')

router.get('/', passport.authenticate("jwt", {session: false}), async (req, res, next) =>{
    const classes = await Class.query()
      .skipUndefined()
      .eager('UserClass.User')
      .catch((err) => {
        ErrorHandler(err, res);
      });
    res.send(classes);
});

router.get('/pure', passport.authenticate("jwt", {session: false}), async (req, res, next) => {
  const classes = await Class.query()
    .skipUndefined()
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
    const user = await Class.query()
      .insert({
        교육명: dataIn.className,
        교육일: dataIn.classDate,
        CAS: dataIn.classCAS,
        ARC: dataIn.classARC
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
    const user = await Class.query()
      .update({
        교육명: dataIn.className,
        교육일: dataIn.classDate,
        CAS: dataIn.classCAS,
        ARC: dataIn.classARC
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
    const user = await Class.query()
      .deleteById(id)
      .catch((err) => {
        ErrorHandler(err, res);
      });
    res.send(dataOut);
});

module.exports = router