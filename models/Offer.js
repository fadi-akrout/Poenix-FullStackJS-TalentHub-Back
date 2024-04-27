const mongoose = require('mongoose');

const JobType = {
    FULL_TIME: 'Full Time',
    PART_TIME: 'Part Time',
    CONTRACT: 'Contract',
    SUMMER_INTERNSHIP: 'Summer internship',
    PFE: 'PFE',
  };

const OfferSchema = new mongoose.Schema({
    Title : String,
    Experience_required: String,
    Domain: String,
    Mission: String,
    Salary: Number,
    Speciality: String,
    JobType: {
        type: String,
        enum: Object.values(JobType),
      },
    JobCity: String,
    rating: {
      type: Number,
      //required: true
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ]

});

module.exports = mongoose.model('Offer', OfferSchema);