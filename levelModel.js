const mongoose = require('mongoose');

const levelSchema = new mongoose.Schema({
    level : {type : Number},
    ashers : {type : Number}
});

const Level = mongoose.model('levels', levelSchema);

module.exports = Level;