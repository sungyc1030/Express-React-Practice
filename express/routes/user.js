var express = require('express');
var router = express.Router({mergeParams: true});
var User = require('../models/User');
var ErrorHandler = require('../scripts/error');
//var db = require('../scripts/db')

/* GET users listing. */
router.get('/', async (req, res, next) => {
  const users = await User.query()
    .skipUndefined()
    .eager('UserClass.Class')
    .catch((err) => {
      ErrorHandler(err, res);
    });
  res.send(users);
});

router.post('/', async (req, res, next) => {
  var dataIn = req.body;
  var dataOut = {
    mes: "Success"
  }
  const user = await User.query()
    .insert({
      유저번호: dataIn.userNo,
      이름: dataIn.userName,
      비밀번호: '1234',
      소속: dataIn.userAffil,
      파트: dataIn.userPart,
      직종: dataIn.userJob,
      이메일: dataIn.userEmail,
      전화번호: dataIn.userPhone,
      레벨: dataIn.userLevel,
      애드민: dataIn.userAdmin
    })
    .catch((err) => {
      ErrorHandler(err, res);
    });
  res.send(dataOut);
});

router.get('/:userid', function(req, res, next){
  res.send('test');
});

router.post('/:userid', async function(req, res, next){
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

router.delete('/:userid', async function(req, res, next){
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

module.exports = router;
