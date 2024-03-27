const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { generateOTP, mailTransport, createRandomBytes, generatePasswordResetTemplate, plainEmailTemplate } = require('../utils/mail')
const VerificationToken = require('../models/verificationToken')
const { isValidObjectId } = require('mongoose')
const ResetToken = require('../models/resetToken')
const crypto = require('crypto')
const PWD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@!#$%])[A-Za-z\d@!#$%]{8,}$/

// @desc Login
// @route POST /auth
// @access Public
const login = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const foundUser = await User.findOne({ email }).exec()

    if (!foundUser) {
        return res.status(401).json({ message: 'Unauthorized' })
    }
    if(!foundUser.active){
        return res.status(403).json({message:'This account has been deactivated by the adminstrator'})
    }

    const match = await bcrypt.compare(password, foundUser.password)

    if (!match) return res.status(401).json({ message: 'Unauthorized' })

    const accessToken = jwt.sign(
        {
            "UserInfo": {
                "email": foundUser.email,
                "roles": foundUser.roles,
                "username": foundUser.username,

            }
        },
        process.env.SECRET,
        { expiresIn: '15m' }
    )

    const refreshToken = jwt.sign(
        { "email": foundUser.email },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    )

    // Create secure cookie with refresh token 
    res.cookie('jwt', refreshToken, {
        httpOnly: true, //accessible only by web server 
        secure: true, //https
        sameSite: 'None',
         //cross-site cookie 
        maxAge: 7 * 24 * 60 * 60 * 1000 //cookie expiry: set to match rT
    })

    // Send accessToken containing username and roles 
    res.json({ accessToken })
}

// @desc Refresh
// @route GET /auth/refresh
// @access Public - because access token has expired
const refresh = (req, res) => {
    const cookies = req.cookies

    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' })

    const refreshToken = cookies.jwt

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })

            const foundUser = await User.findOne({ email: decoded.email }).exec()

            if (!foundUser) return res.status(401).json({ message: 'Unauthorized' })

            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "email": foundUser.email,
                        "roles": foundUser.roles,
                        "username": foundUser.username,

                    }
                },
                process.env.SECRET,
                { expiresIn: '15m' }
            )

            res.json({ accessToken })
        }
    )
}

// @desc Logout
// @route POST /auth/logout
// @access Public - just to clear cookie if exists
const logout = (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204) //No content
    res.clearCookie('jwt', { httpOnly: true,sameSite: 'None', secure: true })
    res.json({ message: 'Cookie cleared' })
}
const createToken=(_id) =>{
    return jwt.sign({_id}, process.env.SECRET, {expiresIn: '10  m'})
  
}

//sign up
const signupUser = async (req, res) => {
    const { username,email, password, roles,active } = req.body

    // Confirm data
    if (!email || !password || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate username
    const duplicate = await User.findOne({ email }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate email' })
    }

    // Hash password 
    const hashedPwd = await bcrypt.hash(password, 10) // salt rounds

    const userObject = { username,email, "password": hashedPwd, roles,active }
   
    const user = await User.create(userObject)

    if (user) {
        const OTP = generateOTP()
        const verificationToken = new VerificationToken({
            owner: user._id,
            token: OTP
        })

        await VerificationToken.create(verificationToken)
        
        mailTransport().sendMail({
            to: user.email,  
            from: `Amir Laroussi <amirlaroussi2023@gmail.com>`, 
            subject: 'Please verify your account on our website',
            text: `Hello ${username},\n\nThank you for registering with us.\n\nPlease confirm your account `,
            html:  `<h1>${OTP}</h1>`,
           
        });


        res.status(201).json({ message: `New user ${username} created` })
    } else {
        res.status(400).json({ message: 'Invalid user data received' })
    }
    }


// @desc Create new user
// @route POST /users
// @access Private
const createNewUserSignup = async (req, res) => {
    const { username,email, password, roles,active } = req.body

    // Confirm data
    if (!email || !password || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate username
    const duplicate = await User.findOne({ email }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate email' })
    }

    // Hash password 
    const hashedPwd = await bcrypt.hash(password, 10) // salt rounds

    const userObject = { username,email, "password": hashedPwd, roles,active }

    // Create and store new user 
    const user = await User.create(userObject)

    if (user) { //created 
        res.status(201).json({ message: `New user ${username} created` })
    } else {
        res.status(400).json({ message: 'Invalid user data received' })
    }
}

const verifyEmail =  async (req, res) => {
    const {userId, otp} = req.body
    if(!userId||!otp.trim()) return res.status(401).json({ message: 'Invalid request, missing paremeters!' })

    if(!isValidObjectId(userId)) return  res.status(400).send('Invalid ID')
    
    let user = await User.findById(userId)
    if(!user) return res.status(404).json({message:"No account with this userID exists"})

    if(user.verified) return  res.status(200).json({message:'This account is already verified.'})

   const token= await VerificationToken.findOne({owner: user._id})
   if(!token) return  res.status(403).json({message:'User not found.'})

   const isMatched= await token.compareToken(otp)
   if(!isMatched) return res.status(401).json({message:'The OTP provided does not match our records.'});

   user.verified=true;
   await VerificationToken.findByIdAndDelete(token._id);
   //await token.remove();
   await user.save()

   res.status(200).json({message:`${user.username},  your account has been successfully verified.`})

   mailTransport().sendMail({
    to: user.email,  
    from: `Amir Laroussi <amirlaroussi2023@gmail.com>`, 
    subject: 'Please verify your account on our website',
    text: `Hello,\n\nThank you for registering with us.\n\nYour account has been confirmed, Enjoy ! `,
    html:  `<h1>Email Verified Successfully thanks for connecting with us</h1>`,
   
});


}

const forgotPassword =  async (req, res) => {
    const {email} =req.body;
    if(!email) return    res.status(400).json({ message: "Missing email in the request!" });

    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "No user found with that email." });

   const token = await ResetToken.findOne({ owner : user._id }) ;   
   if (token)  return res.status(400).json({ message: "Please wait at least  5 min before trying again" });
    
    const newtoken = await createRandomBytes()
    const resetToken = new ResetToken({ owner: user._id , token: newtoken });
    await resetToken.save();

        // If token is created less than  5 minutes ago, show it again.
      
    mailTransport().sendMail({
      to: user.email,    
      from: `"Forgot Password" <forgotpassworl@example.com>`, 
      subject: "Reset your password",
      text: `Hello,\n\nYou are receiving this because you (or someone else) have requested the reset of the password for your account`,  
      html: generatePasswordResetTemplate(`http://localhost:5173/dash/reset-password?token=${newtoken}&id=${user._id}`),
   });

   res.status(200).json({message:"Check Your Email To Continue"});
    
}

const resetPassword =  async (req, res) => {
    const { password }= req.body;
    const user= await User.findById(req.user._id)
    if(!user)    return res.status(400).json({ message: "User not Found" });
    const isSamePassword =await user.comparePassword(password)
    if(isSamePassword )return res.status(400).json({ message: "New password cannot be same as old one" });

    if(!PWD_REGEX.test(password)) return res.status(400).json({ message: `The password must contain at least 8 characters,1number,1min,1maj,1special`})

    const hashedPwd = await bcrypt.hash(password, 10) // salt rounds
    user.password = hashedPwd
    await user.save()

    await ResetToken.findOneAndDelete({owner: user._id})

    mailTransport().sendMail({
        to: user.email,    
        from: `"Reset Password" <resetpassworl@example.com>`, 
        subject: "Password Reset Successfully ",
        text: `Hello,\n\nYou are receiving this because you (or someone else) have requested the reset of the password for your account`,  
        html:plainEmailTemplate("Password Reset Successfully","Now you can login with new password!"),
     });
     res.status(200).json({message:'Password has been changed', success: true});

}
   




module.exports = {
    login,
    refresh,
    logout,
    signupUser,
    createNewUserSignup,
    verifyEmail,
    forgotPassword,
    resetPassword
}



