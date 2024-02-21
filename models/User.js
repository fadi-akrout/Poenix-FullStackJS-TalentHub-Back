const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
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
  
  admin: {
    type: Schema.Types.ObjectId,
    ref: 'Admin'
  },
  recruiter: {
    type: Schema.Types.ObjectId,
    ref: 'Recruiter'
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
