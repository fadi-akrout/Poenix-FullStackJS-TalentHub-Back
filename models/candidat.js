const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Candidat = new Schema({
    diploma: String,
    actualPost: String,
    experience: Number,
    lastPostOccupied: String,
    cv: {
        type: String,
        required: true
    },
    skills: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill'
    }
});

module.exports = mongoose.model('candidat', Candidat);