// Add this route in your Express server setup
const QuizResult = require('../models/QuizResult'); // Assuming this path is correct
const express = require('express');
const router = express.Router();

router.post('/quiz-results', async(req, res) => {
    const { userId, quizId, offerId, score } = req.body;

    try {
        const newQuizResult = new QuizResult({
            user: userId,
            quiz: quizId,
            offer: offerId,
            score: score
        });

        await newQuizResult.save();
        res.status(201).json(newQuizResult);
    } catch (error) {
        console.error('Failed to save quiz result:', error);
        res.status(500).json({ message: 'Failed to save quiz result', error: error.toString() });
    }
});
router.post('/quiz-results/latest', async(req, res) => {
    const { userId, quizId } = req.body; // Accessing userId and quizId from the request body

    try {
        const results = await QuizResult.find({ user: userId, quiz: quizId })
            .sort({ createdAt: -1 }) // Sort by createdAt descending to get the latest result
            .limit(1); // Limit to only one result

        if (results.length > 0) {
            res.json(results[0]); // Send the latest result if found
        } else {
            res.status(404).json({ message: 'No results found' }); // Send 404 if no results
        }
    } catch (error) {
        console.error('Failed to fetch latest quiz result:', error);
        res.status(500).json({ message: 'Server error' }); // Send server error status if an exception occurs
    }
});
router.get('/quiz-results', async (req, res) => {
    const { userId, offerId } = req.query; // Accessing userId and offerId from the query parameters
  
    try {
      const results = await QuizResult.find({ user: userId, offer: offerId });
  
      if (results.length > 0) {
        res.json(results); // Send the results if found
      } else {
        res.status(404).json({ message: 'No results found' }); // Send 404 if no results
      }
    } catch (error) {
      console.error('Failed to fetch quiz results:', error);
      res.status(500).json({ message: 'Server error' }); // Send server error status if an exception occurs
    }
  });

module.exports = router;