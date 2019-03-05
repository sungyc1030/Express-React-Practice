var express = require('express');
var router = express.Router();
var db = require('../scripts/db')

/* GET users listing. */
router.get('/', function(req, res, next) {
  db.connect()
  var pool = db.get()
  var sql = 'SELECT * FROM 유저'
  pool.query(sql, function(err,results,fields){
    
  })
});

module.exports = router;
