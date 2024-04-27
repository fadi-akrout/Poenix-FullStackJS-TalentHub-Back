const express = require('express');
const router = express.Router();
const Question = require('../models/Question');

router.get('/api/questions', async(req, res) => {
    const questions = await Question.find();
    res.json(questions);
});

router.post('/api/questions', async(req, res) => {
    const newQuestion = new Question(req.body);
    const savedQuestion = await newQuestion.save();
    res.status(201).json(savedQuestion);
});

module.exports = router;