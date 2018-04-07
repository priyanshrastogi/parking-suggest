const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jsonwebtoken = require('jsonwebtoken');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const config = require('./config');
const User = require('./models/users');

passport.use(
    new GoogleStrategy({
    clientID: config.clientID,
    clientSecret: config.clientSecret,
    callbackURL: '/auth/google/callback'
    }, (accessToken, refreshToken, profile, done) => {
        User.findOne({googleId: profile.id})
        .then((user) => {
            if(user) {
                done(null, user);
            }
            else {
                User.create({ googleId: profile.id })
                .then((user) => {
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
        User.findById(payload.id)
        .then(user)
    }
    )
)
