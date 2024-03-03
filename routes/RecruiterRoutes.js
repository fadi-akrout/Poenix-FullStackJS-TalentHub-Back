const express = require('express');
const router = express.Router();
const Recruiter = require('../models/Recruiter');

// POST: Créer un nouveau recruteur
router.post('/', async(req, res) => {
    try {
        const newRecruiter = new Recruiter(req.body);
        const savedRecruiter = await newRecruiter.save();
        res.status(201).json(savedRecruiter);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// GET: Lire les recruteurs
router.get('/', async(req, res) => {
    try {
        const recruiters = await Recruiter.find();
        res.json(recruiters);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET: Lire un recruteur spécifique par ID
router.get('/:id', getRecruiter, (req, res) => {
    res.json(res.recruiter);
});

// PUT: Mettre à jour un recruteur
router.put('/:id', getRecruiter, async(req, res) => {
    try {
        const updatedRecruiter = await Recruiter.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedRecruiter);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE: Supprimer un recruteur
router.delete('/:id', async(req, res) => {
    try {
        const recruiter = await Recruiter.findById(req.params.id);
        if (!recruiter) {
            return res.status(404).json({ message: 'Recruiter not found' });
        }
        await Recruiter.findByIdAndDelete(req.params.id);
        res.json({ message: 'Recruiter deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Middleware pour obtenir un recruteur par ID
async function getRecruiter(req, res, next) {
    let recruiter;
    try {
        recruiter = await Recruiter.findById(req.params.id);
        if (recruiter == null) {
            return res.status(404).json({ message: 'Cannot find recruiter' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

    res.recruiter = recruiter;
    next();
}

module.exports = router;