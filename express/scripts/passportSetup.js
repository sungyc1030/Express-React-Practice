const passport = require('passport');
const LocalStartegy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const JWTStarategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const UserModel = require('../models/User');
const secret = 'Korea University Anam Hospital';

passport.use(new LocalStartegy({
        usernameField: 'username',
        passwordField: 'password'
    },function (username, password, done){
        UserModel.query()
            .where('로그인ID', username)
            .first()
            .then(function (user){
                if (!user) return done(null, false, {message: "Unknown user"} );

                user.verifyPassword(password, function(err, passwordCorrect){
                    if (err){
                        return done(err);
                    }
                    if (!passwordCorrect){
                        return done(null, false);
                    }
                    return done(null, user);
                })
            }).catch(function (err){
                done(err);
            })
    }
));

passport.use(new JWTStarategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken('Bearer'),
        secretOrKey: secret,
        ignoreExpiration: true
    }, function(jwtPayload, done){
        /*Front end takes care of jwt expiration
        if(Date.now() > jwtPayload.expires){
            return done('jwt expired');
        }*/
        //In case of jwt forgery
        //console.log(jwtPayload);
        try{
            UserModel.query()
                .where('유저번호', jwtPayload.userno)
                .then(user => {
                    if(user){
                        return done(null, jwtPayload);
                    }else{
                        return done(null, false);
                    }
                });
        }catch(err){
            console.log(err);
            return done(err);
        }
    }
))