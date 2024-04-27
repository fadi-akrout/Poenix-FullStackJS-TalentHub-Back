const mongoose = require('mongoose');

const EvenementSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    adresse: { type: String, required: true },
    dateDebut: { type: Date, required: true },
    dateFin: { type: Date, required: true },
    description: String,
    image: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    participants: [{ // Nouveau champ pour stocker les participants
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, { timestamps: true });

const Evenement = mongoose.model('Evenement', EvenementSchema);
module.exports = Evenement;