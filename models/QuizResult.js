const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true
    },
    offer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Offer',
        required: true
    },
    score: {
        type: Number,
        required: true
    }
}, { timestamps: true }); // This will automatically add createdAt and updatedAt fields

const QuizResult = mongoose.model('QuizResult', quizResultSchema);

module.exports = QuizResult;