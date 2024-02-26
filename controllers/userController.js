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
//refresh
const refresh=async(req,res)=> {
    const token = req.headers['x-access-token'] || req.headers['authorization'];  
    if (!token) {return res.status(403).send({auth: false, message: 'No token provided.'});}

    let decoded;
    try{
       decoded = jwt.verify(token.split(' ')[1], process.env.SECRET_KEY);
       const user = await User.findById(decoded.id)  
       const newToken = createToken(user._id, true)  
       res.header("Authorization", newToken).send(newToken);  
    } catch (err) { 
      console.log(err); 
      res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });  
    }   
}


module.exports= {
    loginUser, 
    signupUser,
    refresh
}
    
