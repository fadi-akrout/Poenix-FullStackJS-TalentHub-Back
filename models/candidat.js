const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Candidat = new Schema({
    FullName: String,
    Phone: Number,
    Adresse: String
});

module.exports = mongoose.model('candidat', Candidat);