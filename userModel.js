const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username : {type : String , reuqired : true},
  maxLevel : {type : Number , required : true},
  currentLevel : {type: Number, default: 0, required: true}
});

const Task = mongoose.model('User', userSchema);

module.exports = Task;