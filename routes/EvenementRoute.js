const express = require('express');
const router = express.Router();
const Evenement = require('../models/Evenement');
const User = require('../models/User')

const { generateOTP, mailTransport, createRandomBytes, generatePasswordResetTemplate, plainEmailTemplate } = require('../utils/mail')

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
    const { userId } = req.body;
    const { id } = req.params;

    try {
        const event = await Evenement.findById(id);
        const user = await User.findById(userId);
        if (!event) return res.status(404).json({ message: "Event not found" });
        if (!user) return res.status(404).json({ message: "User not found" });

        if (!event.participants.includes(userId)) {
            event.participants.push(userId);
            await event.save();

            const htmlContent = `
                <html>
                <body>
                    <h1>Event Participation Confirmation</h1>
                    <p>Dear ${user.username},</p>
                    <p>You have successfully registered for the event: ${event.nom}.</p>
                    <p>Event Date: ${event.dateDebut}</p>
                    <p>If you have any questions, you can contact us at any time.</p>
                </body>
                </html>
            `;

            await mailTransport().sendMail({
                to: user.email,
                from: `"Event Participation" <sarah.ranmori@gmail.com>`,
                subject: `Participation confirmed for event: ${event.nom}`,
                html: htmlContent
            });

            res.status(200).json({ message: 'Participation recorded successfully' });
        } else {
            res.status(400).json({ message: 'User is already registered for this event' });
        }
    } catch (error) {
        console.error('Error during participation:', error);
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