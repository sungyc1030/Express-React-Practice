var express = require('express');
var router = express.Router({mergeParams: true});
var Class = require('../models/Class');
var ErrorHandler = require('../scripts/error');
//var db = require('../scripts/db')

router.get('/', async (req, res, next) =>{
    const classes = await Class.query()
      .skipUndefined()
      .eager('UserClass.User');
    res.send(classes);
});

router.post('/', async function(req, res, next){
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

router.post('/:classid', async function(req, res, next){
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

router.delete('/:classid', async function(req, res, next){
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