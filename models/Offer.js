const mongoose = require('mongoose');
// Define the JobType enumeration
const JobType = {
    FULL_TIME: 'Full Time',
    PART_TIME: 'Part Time',
    CONTRACT: 'Contract',
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
        enum: Object.values(JobType), // Specify the allowed values from the JobType enumeration
      },
    JobCity: String,

});

module.exports = mongoose.model('Offer', OfferSchema);