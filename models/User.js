const mongoose = require('mongoose');
const bcrypt= require('bcrypt')
const Schema = mongoose.Schema;

const userSchema = new Schema({
  Id:Number,
  FirstName: String,
  LastName: String,
  PhoneNumber: Number,
  Diploma: String,
  LastPostOccupied: String,
  NbrOfExperience: Number,

  email: {
    type: String, 
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  roles: [{
    type: String,
    default: "Employee"
}],
 /*  role: {
    type: String,
    enum: ['admin', 'recruiter', 'student', 'alumni', 'satff'],
    default: 'user' 
  }, */

  active: {
    type: Boolean,
    default: true 
  }


 
  
})

// static signup method ======================
userSchema.statics.signup = async function(email,password) {

  const exists= await this.findOne({email})
  if(exists) {
    throw new Error('Email already in use')
  }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt)

    const user=await this.create({email,password:hash})
    return user;
}
// end of static signup method ======================


const User = mongoose.model('User', userSchema);


module.exports = User;

