const express = require('express');
const router = express.Router();
const Score = require('../models/Score'); // Adjust path as necessary

// Route to post a new score
router.post('/api/scores', async(req, res) => {
    try {
        const { userId, questions, score } = req.body;
        const newScore = new Score({ userId, questions, score });
        const savedScore = await newScore.save();
        res.status(201).json(savedScore);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to get scores for a user
router.get('/api/scores/user/:userId', async(req, res) => {
    try {
        const userScores = await Score.find({ userId: req.params.userId }).populate('questions');
        res.json(userScores);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to get a specific score by id
router.get('/scores/:id', async(req, res) => {
    try {
        const score = await Score.findById(req.params.id).populate('questions');
        res.json(score);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Other routes (update, delete) can also be added here

module.exports = router;