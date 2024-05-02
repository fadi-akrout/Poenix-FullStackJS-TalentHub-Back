const express = require('express');
const router = express.Router();
const FeedBack = require('../models/FeedBack');

// POST method to save feedback
router.post('/feedback', async (req, res) => {
    try {
        const { offerId, userId, rating } = req.body;

        // Check if feedback already exists for the same offer ID and user ID
        const existingFeedback = await FeedBack.findOne({ offerId, userId });

        if (existingFeedback) {
            return res.status(400).send("Feedback already exists for this offer and user.");
        }

        // If feedback doesn't exist, save it
        const feedback = new FeedBack({ 
            offerId,
            userId,
            rating
        });

        const savedFeedback = await feedback.save();
        res.status(201).send(savedFeedback);
    } catch (err) {
        res.status(400).send(err);
    }
});

// GET method to fetch feedback statistics
router.get('/feedback/stats', async (req, res) => {
    try {
      // Fetch all feedback entries and populate the user information
      const feedbackData = await FeedBack.find().populate('user', 'username');
  
      // Construct the data array with user and rating information
      const stats = feedbackData.map((feedback) => ({
        _id: feedback._id,
        user: feedback.user.username,
        rating: feedback.rating,
      }));
  
      res.status(200).json(stats);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  // GET method to fetch existing feedback for an offer ID
  router.get('/feedback/:offerId', async (req, res) => {
      try {
          const offerId = req.params.offerId;
  
          // Find existing feedback for the given offer ID
          const existingFeedback = await FeedBack.findOne({ offerId });
  
          if (!existingFeedback) {
              return res.status(404).send("No feedback found for this offer.");
          }
  
          res.status(200).send(existingFeedback);
      } catch (err) {
          res.status(500).send(err);
      }
  });

module.exports = router;
