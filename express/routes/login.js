var express = require('express');
var router = express.Router({mergeParams: true});
var passport = require('passport');
var jwt = require('jsonwebtoken');
//var bcrypt = require('bcryptjs');

//const UserModel = require('../models/User');
const secret = 'Korea University Anam Hospital';

/*router.post('/register', async(req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const hashCost = 10;

    try{
        const passwordHash = await bcrypt.hash(password, hashCost);
        const userDocument = new UserModel({ username, passwordHash});
        await userDocument.save();

        res.status(200).send({username});
    }catch(error){
        res.status(400).send({
            error: 'req body should take the form {username, password}'
        });
    }
});*/

router.post('/', function(req, res, next){
    passport.authenticate('local', {session: false},(error, user, info) => {
        if (error || !user){
            res.status(400).json(
                {
                    error: error,
                    message: info? info.message : 'Login Failed (no information available)',
                    user: user
                }
            );
            return;
        }

        const payload = {
            username: user.이름,
            userno: user.유저번호,
            admin: user.애드민,
            expires: Date.now() + (60 * 60 * 1000)
        }

        req.login(payload, {session: false}, (error) => {
            if (error){
                res.status(400).send({error});
            }

            const token = jwt.sign(JSON.stringify(payload), secret);
            
            //res.cookie('jwt', jwt, {httpOnly: true, secure: true});
            res.status(200).send({user, token});
        });
    })(req, res);
});

module.exports = router