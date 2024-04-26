const express = require('express');
const router = express.Router();
const Evenement = require('../models/Evenement');


// Create
router.post('/', async(req, res) => {
    const evenement = new Evenement(req.body);
    try {
        const savedEvenement = await evenement.save();
        res.status(201).send(savedEvenement);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Read
router.get('/', async(req, res) => {
    try {
        const evenements = await Evenement.find();
        res.json(evenements);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Update
router.patch('/:id', async(req, res) => {
    try {
        const updatedEvenement = await Evenement.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedEvenement);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Delete
router.delete('/:id', async(req, res) => {
    try {
        await Evenement.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (err) {
        res.status(500).send(err);
    }
});

// Exemple d'une route dans Express pour participer à un événement
router.post('/:id/participate', async(req, res) => {
    const { userId } = req.body; // Assurez-vous que l'ID de l'utilisateur est envoyé dans le corps de la requête
    const { id } = req.params; // ID de l'événement

    try {
        const evenement = await Evenement.findById(id);
        if (!evenement.participants.includes(userId)) {
            evenement.participants.push(userId); // Ajouter l'utilisateur à la liste des participants
            await evenement.save();
            res.status(200).json({ message: 'Participation enregistrée' });
        } else {
            res.status(400).json({ message: 'Vous participez déjà à cet événement' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.post('/:id/annulerParticipation', async(req, res) => {
    const { userId } = req.body; // Assurez-vous que l'ID de l'utilisateur est envoyé dans le corps de la requête
    const { id } = req.params; // ID de l'événement

    try {
        // Trouver l'événement par ID
        const evenement = await Evenement.findById(id);

        // Vérifier si l'utilisateur est déjà dans la liste des participants
        if (evenement.participants.includes(userId)) {
            // Retirer l'utilisateur de la liste des participants
            evenement.participants = evenement.participants.filter(participantId => participantId.toString() !== userId);
            await evenement.save(); // Sauvegarder les modifications
            res.status(200).json({ message: 'Participation annulée avec succès' });
        } else {
            res.status(400).json({ message: 'Utilisateur non trouvé dans la liste des participants' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



module.exports = router;