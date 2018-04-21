const express = require('express');
const userRouter = express.Router();
const User = require('../models/user');

userRouter.route('/:email')
.get((req, res, next) => {
    User.findOne({email: req.params.email})
    .then((user) => {
        res.send(user);
    })
    .catch((err) => {
        return next(err);
    })
});

userRouter.route('/:email/rfid')
.post((req, res, next) => {
    User.findOne({email: req.params.email})
    .then((user) => {
        if(user !== null) {
            user.rfidTag = req.body.rfidTag;
            user.save()
            .then((user) => {
                res.send({success: true});
            })
            .catch(err => { return next(err) });
        }
    })
    .catch((err) => {
        return next(err);
    })
});

module.exports = userRouter;