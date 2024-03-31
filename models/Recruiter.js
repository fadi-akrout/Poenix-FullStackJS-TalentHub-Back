const mongoose = require('mongoose');

const RecruiterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number,
        required: true,
        
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
});

module.exports = mongoose.model('Recruiter', RecruiterSchema);