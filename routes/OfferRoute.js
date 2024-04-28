const express = require('express');
const router = express.Router();
const Offer = require('../models/Offer');
const User = require('../models/User');
const OfferUser = require('../models/OfferUser');
const applyToOffer = require('../controllers/applyToOffer')

const Quiz = require('../models/Quiz');

// Create
router.post('/', async(req, res) => {
    const offer = new Offer(req.body);
    try {
        const savedOffer = await offer.save();
        res.status(201).send(savedOffer);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Read
router.get("/", async(req, res) => {
    try {
        const { q } = req.query;
        const fieldNames = ["Title", "Experience_required", "Domain", "Mission", "Speciality", "JobType", "JobCity"]; // Replace with your desired field names
        const regexQueries = fieldNames.map((fieldName) => ({
            [fieldName]: { $regex: q, $options: 'i' }
        }));
        const query = q ? { $or: regexQueries } : {};
        const offers = await Offer.find(query);
        res.json(offers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred" });
    }
});
/* router.get('/', async(req, res) => {
    try {
        const offers = await Offer.find();
        res.json(offers);
    } catch (err) {
        res.status(500).send(err);
    }
}); */
router.get('/getoffer/:id', async(req, res) => {

    const id = req.params.id;
    Offer.findById({ _id: id })
        .then(offers => res.json(offers))
        .catch(err => res.json(err))
});

// Update
router.patch('/:id', async(req, res) => {
    try {
        const updatedOffer = await Offer.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedOffer);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Delete
router.delete('/:id', async(req, res) => {
    try {
        await Offer.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (err) {
        res.status(500).send(err);
    }
});

router.post('/:id/quiz', async(req, res) => {
    try {
        const { id } = req.params;
        const { title, questions } = req.body; // Assurez-vous que 'questions' est un tableau d'IDs de questions

        // Création d'un nouveau quiz
        const newQuiz = new Quiz({
            offer: id,
            title: title,
            questions: questions // Ici, 'questions' doit être un tableau d'IDs
        });

        // Sauvegarde du quiz dans la base de données
        const savedQuiz = await newQuiz.save();

        // Association du quiz à l'offre spécifique
        const offer = await Offer.findById(id);
        offer.quiz = savedQuiz._id;
        await offer.save();

        res.status(201).json(savedQuiz);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
});



router.post('/apply/:userId/:offerId', applyToOffer);

module.exports = router;