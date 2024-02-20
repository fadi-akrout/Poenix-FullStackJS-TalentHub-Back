const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Evenement = new Schema({
    FullName: String,
    Phone: Number,
    Adresse: String
});

module.exports = mongoose.model('Evenements', Evenement);