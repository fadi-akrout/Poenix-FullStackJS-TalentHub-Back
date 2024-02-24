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

module.exports = router;