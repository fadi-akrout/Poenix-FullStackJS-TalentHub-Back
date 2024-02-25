const User= require('../models/User')
//login
const loginUser= async(req,res)=>{
    res.json({mssg: 'login user'})
}
    

//sign up
const signupUser= async(req,res)=>{
    const {email, password} = req.body
    try{
        const user = await User.signup(email,password)

        res.status(200).json({email, user})
    }catch(error){
        return res.status(400).json({message: error.message})
    }

}

module.exports= {
    loginUser, 
    signupUser
}
    
