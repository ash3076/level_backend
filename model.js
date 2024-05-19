const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  taskTitle: { type: String, required: true },
  description: { type: String, required: true },
  score: { type: Number, required: true },
  isPos: { type: Boolean, required: true }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;