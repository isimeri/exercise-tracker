const mongoose = require('mongoose');
const exerciseSchema = new mongoose.Schema({
    user_id: String,
    description: {type: String, default: 'very nice'},
    duration: {type: Number, default: 5},
    date: {type: Date, default: Date.now}
});

const exerciseModel = new mongoose.model("exercise", exerciseSchema);

module.exports = exerciseModel;