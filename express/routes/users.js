var express = require('express');
var router = express.Router({mergeParams: true});
var db = require('../scripts/db')

/* GET users listing. */
router.get('/', function(req, res, next) {
  db.connect()
  var pool = db.get()
  var sql = 'SELECT * FROM 유저'
  pool.query(sql, function(err,results,fields){
    
  })
});

router.post('/', function(req, res, next){
  console.log(req.body);
  res.send('I received your POST request. This is what you sent me: ' + req.body.post);
});

router.get('/:userid(\d+)', function(req, res, next){

});

router.post('/:userid(\d+)', function(req, res, next){

});

router.delete('/:userid(\d+)', function(req, res, next){
  
});

module.exports = router;
