const express = require('express');
const router = express.Router();
const FeedBack = require('../models/FeedBack'); // Correct import name

router.post('/feedback', async (req, res) => {
    try {
        const feedback = new FeedBack({ 
            offerId: req.body.offerId,
            rating: req.body.rating
        });
        const savedFeedback = await feedback.save();
        res.status(201).send(savedFeedback);
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;
