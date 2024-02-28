const mongoose = require('mongoose');
const bcrypt= require('bcrypt')
const validator = require('validator')
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
  //validation
  if(!email || !password) { 
    throw new Error('Email or Password not provided') 
  }
  if (!validator.isEmail(email)) {
    throw new Error("Invalid Email")
  }
  if(!validator.isStrongPassword(password) ) {
    throw new Error("Password not strong enough")
  }

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
// static login method ====================== 
  userSchema.statics.login = async function (email, password) {
    if(!email || !password) { 
      throw new Error('Email or Password not provided') 
    }
    const user= await this.findOne({email})
    if(!user) {
      throw new Error('Incorrect Email')
    }
    if(!user.active) {
      throw new Error('Banned Account')
    }
    const match= await bcrypt.compare(password, user.password)
    if(!match) {
        throw new Error('Incorrect Password')
    }
  
    return user;
  }
// end of static login method ====================== 
//


const User = mongoose.model('User', userSchema);


module.exports = User;

