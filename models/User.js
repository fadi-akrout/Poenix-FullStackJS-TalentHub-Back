const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
    FullName: String,
    Phone: Number,
    Adresse: String,
    CIN: Number
});

module.exports = mongoose.model('user', User);