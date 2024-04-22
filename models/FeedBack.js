const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    offerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    rating: {
        type: Number,
        required: true
    }
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
