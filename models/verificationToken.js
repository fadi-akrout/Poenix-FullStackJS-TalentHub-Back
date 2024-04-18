const mongoose = require('mongoose');
 const bcrypt= require('bcryptjs')
 const Schema = mongoose.Schema;

 const verificationTokenSchema = new Schema({
   owner:{
    type: mongoose.Schema.Types.ObjectId,  //owner is the user who created this token
    ref:'User',
     required:true
    }, 
    token: {
        type:String ,
        required: true
    },
    createdAt: {  
        type: Date,
        expires:3600,
        default: Date.now()  
    }
  });
  verificationTokenSchema.pre( 'save', async function (next) {
        if (this.isModified('token')){
            const hash= await bcrypt.hash(this.token ,10);
            this.token = hash ;
        }   
        next();
});
verificationTokenSchema.methods.compareToken = async function(token){
       return await bcrypt.compareSync(token, this.token) 
}

module.exports = mongoose.model("VerificationToken", verificationTokenSchema);