const mongoose = require('mongoose');

const EvenementSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    adresse: { type: String, required: true },
    dateDebut: { type: Date, required: true },
    dateFin: { type: Date, required: true },
    description: String,
    image: String
}, { timestamps: true }); // Ajoute createdAt et updatedAt automatiquement

// Créer le modèle
const Evenement = mongoose.model('Evenement', EvenementSchema);
module.exports = Evenement;