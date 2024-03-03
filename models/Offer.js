const mongoose = require('mongoose');

const JobType = {
    FULL_TIME: 'Full Time',
    PART_TIME: 'Part Time',
    CONTRACT: 'Contract',
  };

const OfferSchema = new mongoose.Schema({
    Offer_Id: Number,
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

});

module.exports = mongoose.model('Offer', OfferSchema);