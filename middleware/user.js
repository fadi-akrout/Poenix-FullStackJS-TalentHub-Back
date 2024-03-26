const { isValidObjectId } = require("mongoose");
const User = require("../models/User");
const ResetToken= require('../models/resetToken')

exports.isResetTokenValid= async(req,res,next)=>{
    const{token,id} = req.query;
    if(!token || !id) return res.status(400).json({error:"No token or id provided"});
    
    if(!isValidObjectId(id))     
        return res.status(400).json({ error: "Invalid User ID." }); 
    try{
       let user = await User.findById(id)    ;
       if(!user)
           return res.status(400).json({error:'The user with the given Id does not exist.'})
       //Checking if token matches the one in DB and it's not expiredd
      const resetToken= await ResetToken.findOne({owner: user._id});
      if (!resetToken)
          return res.status(400).send({ error: 'Reset Token not found.' });
        
      const isValid = await resetToken.compareToken(token);
      if(!isValid) return    res.status(401).json({ error: 'Invalid reset token.' })  
      req.user = user;
    next()  
    }catch(e){
        console.log(e)
        res.status(500).json({error : e.toString()})
    }
}