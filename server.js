const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose');
require('dotenv').config()
const connectDB = require("./db/connection.js");
const userRouter = require("./routes/Users.js");
const exerciseRouter = require("./routes/Exercises.js");

const app = express();

connectDB();

app.use(cors());
app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));
app.use('/api/users', userRouter);
app.use('/api/users/:id/exercises', exerciseRouter);
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
