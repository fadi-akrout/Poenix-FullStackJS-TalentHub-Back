// models/Quiz.js
const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    offer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Offer',
        required: true
    },
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
    }],
    title: {
        type: String,
        required: true
    }
    // Autres champs comme description, durée, etc.
});

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;