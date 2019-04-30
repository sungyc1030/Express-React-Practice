var express = require('express');
var router = express.Router({mergeParams: true});
var Config = require('../models/Config');
var ErrorHandler = require('../scripts/error');
var bcrypt = require('bcryptjs');
var passport = require('passport');
var jwt_decode = require('jwt-decode');


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

module.exports = router;