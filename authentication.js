const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
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
