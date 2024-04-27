const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scoreSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId, // Link the score to a user
        ref: 'User', // Reference to the User model
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    questions: [{ // An array to hold references to the questions included in the quiz
        type: Schema.Types.ObjectId,
        ref: 'Question'
    }],
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Score', scoreSchema);