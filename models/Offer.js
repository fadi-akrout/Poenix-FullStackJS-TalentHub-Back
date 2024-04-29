const mongoose = require('mongoose');

const JobType = {
    FULL_TIME: 'Full Time',
    PART_TIME: 'Part Time',
    CONTRACT: 'Contract',
    SUMMER_INTERNSHIP: 'Summer internship',
    PFE: 'PFE',
};

const OfferSchema = new mongoose.Schema({
    Title: String,
    Experience_required: String,
    Description: String,
    Mission: String,
    Salary: Number,
    Speciality: String,
    profileImage: { type: String },

    JobType: {
        type: String,
        enum: Object.values(JobType),
    },
    JobCity: String,
    rating: {
        type: Number,
        //required: true
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],

     
    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz'
    }



});

module.exports = mongoose.model('Offer', OfferSchema);