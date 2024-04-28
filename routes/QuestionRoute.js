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

router.get('/api/:quizId/questions', async(req, res) => {
    const { quizId } = req.params;

    try {
        const quiz = await Quiz.findById(quizId); // Trouvez le quiz par son ID
        if (!quiz) {
            return res.status(404).send('Quiz not found');
        }
        res.status(200).json(quiz.questions); // Envoyez les questions du quiz
    } catch (error) {
        console.error("Error fetching quiz questions:", error); // Journalisez l'erreur dans la console du serveur
        res.status(500).json({ message: 'Server error', error: error.toString() });
    }
});

module.exports = router;