const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose');
require('dotenv').config()
const connectDB = require("./db/connection.js");
const userRouter = require("./routes/Users.js");
const exerciseRouter = require("./routes/Exercises.js");
const userModel = require("./db/userModel.js");
const exerciseModel = require("./db/exerciseModel.js");

const app = express();

connectDB();

app.use(cors());
app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));
app.use('/api/users', userRouter);
// app.use('/api/users/:_id/exercises', exerciseRouter);
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/users/:_id/exercises', async (req, res) => {
    try {
        const doesUserExist = await userModel.findOne({_id: req.params._id});
        if(!doesUserExist){
            return res.json({error: 'user not found'});
        }
        const newEx = new exerciseModel({
            user_id: req.params._id,
            description: req.body.description,
            duration: req.body.duration,
            date: req.body.date ? new Date(req.body.date).toDateString() : new Date().toDateString()
        });

        await newEx.save();
        const user = {
            _id: newEx.user_id,
            username: doesUserExist.username,
            date: newEx.date.toDateString(),
            duration: newEx.duration,
            description: newEx.description
        }
        res.json(user);

    } catch (err) {
        res.json({error: err.message});
    }
});

app.get('/api/users/:id/logs', async (req, res) => {
  const from = req.query.from || new Date(0);
  const to = req.query.to || new Date(Date.now());
  const limit = req.query.limit || 0;
  let exeList;
  const user = await userModel.findOne({_id: req.params.id});
  if(!user){
    return res.json({error: "user not found"});
  }

  try {
    exeList = await exerciseModel.find({
      user_id: req.params.id,
      date: {$lte: to, $gte: from}
    }).limit(limit);
  } catch (err) {
    return res.json({error: err.message})
  }
  const mapExeList = exeList.map(exe => {
    return {
      description: exe.description,
      duration: exe.duration,
      date: exe.date.toDateString()
    };
  });

  const response = {
    username: user.username,
    _id: user._id,
    count: exeList.length,
    log: mapExeList
  };

  res.json(response);
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
