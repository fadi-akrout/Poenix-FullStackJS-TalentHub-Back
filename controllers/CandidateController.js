const Candidate = require('../models/candidat');

exports.getAllCandidates = async(req, res) => {
    try {
        const candidates = await Candidate.find();
        res.json(candidates);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Get a single candidate by id
exports.getCandidate = async(req, res) => {
    try {
        const candidate = await Candidate.findById(req.params.id);
        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }
        res.json(candidate);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Create a new candidate
exports.createCandidate = async(req, res) => {
    try {
        const newCandidate = new Candidate(req.body);
        const savedCandidate = await newCandidate.save();
        res.status(201).json(savedCandidate);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Update an existing candidate
exports.updateCandidate = async(req, res) => {
    try {
        const updatedCandidate = await Candidate.findByIdAndUpdate(
            req.params.id,
            req.body, { new: true }
        );
        if (!updatedCandidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }
        res.json(updatedCandidate);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Delete a candidate
exports.deleteCandidate = async(req, res) => {
    try {
        const deletedCandidate = await Candidate.findByIdAndDelete(req.params.id);
        if (!deletedCandidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }
        res.json({ message: 'Candidate deleted successfully' });
    } catch (error) {
        res.status(500).send(error);
    }
};