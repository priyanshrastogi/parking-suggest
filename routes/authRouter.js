const express = require('express');
const authRouter = express.Router();
const auth = require('../authentication');
const passport = require('passport');

authRouter.route('/google')
.get(passport.authenticate('google', { scope: ['profile', 'email'] }));

authRouter.route('/google/callback')
.get(passport.authenticate('google'));

module.exports = authRouter;