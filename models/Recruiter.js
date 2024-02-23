const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recruiterSchema = new Schema({
  Recruiter_id: Number,
  
});

const Recruiter = mongoose.model('Recruiter', recruiterSchema);

module.exports = Recruiter;