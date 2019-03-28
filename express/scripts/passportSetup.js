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
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: secret
    }, function(jwtPayload, done){
        if(Date.now() > jwtPayload.expries){
            return done('jwt expired');
        }
        return done(null, jwtPayload);
    }
))