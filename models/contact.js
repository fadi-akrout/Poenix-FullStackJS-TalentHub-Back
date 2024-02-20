const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Contact = new Schema({
    FullName: String,
    Phone: Number,
    Adresse: String
});

module.exports = mongoose.model('contacts', Contact);