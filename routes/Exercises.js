const express = require('express');
const exerciseModel = require("../db/exerciseModel.js");
const userModel = require('../db/userModel.js');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const user = await userModel.findOne({_id: req.body._id});
        if(!user){
            return res.json({error: 'user not found'});
        }
        const newEx = new exerciseModel({
            user_id: req.body._id,
            description: req.body.description,
            duration: req.body.duration,
            date: req.body.date ? new Date(req.body.date).toDateString() : new Date().toDateString()
        });

        await newEx.save();
        const response = {
            _id: newEx.user_id,
            username: user.username,
            date: newEx.date.toDateString(),
            duration: newEx.duration,
            description: newEx.description
        }
        res.json(response);

    } catch (err) {
        res.json({error: err.message});
    }
});

module.exports = router;