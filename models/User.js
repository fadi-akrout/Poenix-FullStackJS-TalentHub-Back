const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  Id:Number,
  FirstName: String,
  LastName: String,
  PhoneNumber: Number,
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'recruiter', 'student', 'alumni', 'satff'],
    default: 'user' 
  },

  active: {
    type: Boolean,
    default: true 
  },


  Diploma: String,
  LastPostOccupied: String,
  NbrOfExperience: Number,
  
});

const User = mongoose.model('User', userSchema);


module.exports = User;

