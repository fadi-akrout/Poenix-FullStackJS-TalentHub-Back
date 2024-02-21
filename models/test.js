const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var test = new Schema({
    FullName: String,
    Phone: Number,
    Adresse: String
});

module.exports = mongoose.model('test', test);