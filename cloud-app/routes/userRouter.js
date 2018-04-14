const express = require('express');
const userRouter = express.Router();
const User = require('../models/users');

userRouter.route('/:userId')
.get((req, res, next) => {
    User.findById(req.params.userId)
    .then((user) => {
        res.send(user);
    })
    .catch((err) => {
        return next(err);
    })
});

module.exports = userRouter;