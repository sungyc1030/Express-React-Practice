var express = require('express');
var router = express.Router();
var db = require('../scripts/db')

/* GET home page. */
router.get('/api/hello', function(req, res, next) {
  res.send({express: 'Hello From Express'});
});

router.get('/api/users', function(req, res, next){
  db.connect();
  var pool = db.get();
  var sql = 'SELECT * FROM 유저';
  pool.query(sql, function(err,results,fields){
    res.send(results);
  });
});

router.post('/api/world', function(req, res, next){
  console.log(req.body);
  res.send('I received your POST request. This is what you sent me: ' + req.body.post);
});

module.exports = router;