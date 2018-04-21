const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const config = require('../config');
const User = require('../models/user');
const mailer = require('./mailer');

passport.use(
    new GoogleStrategy({
    clientID: config.clientID,
    clientSecret: config.clientSecret,
    callbackURL: '/auth/google/callback'
    }, (accessToken, refreshToken, profile, done) => {
        //console.log(profile);
        User.findOne({googleId: profile.id})
        .then((user) => {
            if(user) {
                done(null, user);
            }
            else {
                User.create({ googleId: profile.id, name: profile.displayName, email: profile.emails[0].value })
                .then((user) => {
                    mailer.sendWelcomeMail(user.email, user.name);
                    done(null, user);
                })
            }
        })
    })
);

passport.use(
    new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.secretKey
    }, (payload, done) => {
            User.findById(payload._id)
            .then((user) => {
                if (user)
                    return done(null, user);
                else
                    return done(null, false);
            })
            .catch((err) => {
                return done(err, false);
            });
        }
    )
);

exports.getJwtForUser = (user) => {
    return jwt.sign({ _id: user._id }, config.secretKey, { expiresIn: '30d' });
}

exports.requireAuth = passport.authenticate('jwt', { session: false });