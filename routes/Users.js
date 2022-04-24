const express = require('express');
const userModel = require('../db/userModel.js');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const userList = await userModel.find();
        res.json(userList);
    } catch (err) {
        res.json({error: err.message});
    }
});
router.post('/', async (req, res) => {
    const user = new userModel({
        username: req.body.username
    });
    try {
        await user.save();
        res.json({username: user.username, _id: user._id});
    } catch (err) {
        res.json({error: err.message});
    }
});

module.exports = router;