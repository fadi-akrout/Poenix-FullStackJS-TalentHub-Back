const mongoose = require('mongoose');

const EvenementSchema = new mongoose.Schema({
    nom: String,
    adresse: String,
    dateDebut: Date,
    dateFin: Date,
    description: String,
    image: String,
});

module.exports = mongoose.model('Evenement', EvenementSchema);