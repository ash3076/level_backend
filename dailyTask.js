const mongoose = require('mongoose');

const dailyTaskSchema = new mongoose.Schema({
    title : {type : String , required : true},
  description: { type: String, required: true },
  ashers: { type: Number, required: true },
  isDone: { type: Boolean, default: false },
});

const DailyTask = mongoose.model('DailyTask', dailyTaskSchema);

module.exports = DailyTask;
