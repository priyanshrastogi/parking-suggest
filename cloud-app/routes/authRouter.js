const express = require('express');
const authRouter = express.Router();
const auth = require('../services/authentication');
const passport = require('passport');

authRouter.route('/google')
.get(passport.authenticate('google', { scope: ['profile', 'email'] }));

authRouter.route('/google/callback')
.get(passport.authenticate('google', { session: false }), (req, res, next) => {
    res.redirect(`https://parking-suggest.netlify.com/authsuccess?uid=${req.user._id}&token=${auth.getJwtForUser(req.user)}&email=${req.user.email}&name=${req.user.name}`)
});

module.exports = authRouter;