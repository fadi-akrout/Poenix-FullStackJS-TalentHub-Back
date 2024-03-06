const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');

router.post('/', async(req, res) => {
    try {
        const candidate = new Candidate(req.body);
        await candidate.save();
        res.status(201).send(candidate);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/last', async(req, res) => {
    try {
        // Assuming there's a createdAt or similar timestamp field in your Candidate schema
        const lastCandidate = await Candidate.findOne().sort({ createdAt: 1 });
        if (!lastCandidate) {
            return res.status(404).send({ message: 'No candidates found' });
        }
        res.status(200).send(lastCandidate);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/', async(req, res) => {
    try {
        const candidates = await Candidate.find();
        res.send(candidates);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/:id', async(req, res) => {
    try {
        const candidate = await Candidate.findById(req.params.id);
        if (!candidate) {
            return res.status(404).send();
        }
        res.send(candidate);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.patch('/:id', async(req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'lastname', 'email', 'diploma', 'actualPost', 'nbrYearsOfExperience', 'lastPostOccupied', 'cv', 'dateOfBirth', 'address', 'city', 'postalCode', 'country', 'phoneNumber', 'skills', 'languages', 'certifications', 'linkedinProfile'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        const candidate = await Candidate.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!candidate) {
            return res.status(404).send();
        }
        res.send(candidate);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.delete('/:id', async(req, res) => {
    try {
        const candidate = await Candidate.findByIdAndDelete(req.params.id);
        if (!candidate) {
            return res.status(404).send();
        }
        res.send(candidate);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;