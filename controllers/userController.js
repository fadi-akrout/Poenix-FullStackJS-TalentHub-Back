const User= require('../models/User')
const jwt = require('jsonwebtoken')

const createToken=(_id) =>{
    return jwt.sign({_id}, process.env.SECRET, {expiresIn: '1h'})
    //, (err, token)=>{
      //  if(err) throw err;
       // return token
    //})

}
//login
const loginUser= async(req,res)=>{
    const{email,password}= req.body
    try{
        const user = await User.login(email,password)
        //create token
        const token = createToken(user._id)

        res.status(200).json({email, token})
    }catch(error){
        return res.status(400).json({message: error.message})
    }

}
    

//sign up
const signupUser= async(req,res)=>{
    const {email, password} = req.body
    try{
        const user = await User.signup(email,password)
        //create token
        const token = createToken(user._id)

        res.status(200).json({email, token})
    }catch(error){
        return res.status(400).json({message: error.message})
    }

}

module.exports= {
    loginUser, 
    signupUser
}
    
