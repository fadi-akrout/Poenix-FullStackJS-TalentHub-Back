/* const User= require('../models/User')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')


const createToken=(_id) =>{
    return jwt.sign({_id}, process.env.SECRET, {expiresIn: '10m'})
    //, (err, token)=>{
      //  if(err) throw err;
       // return token
    //})

}

const refreshToken=(_id) =>{
    return jwt.sign({_id}, process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '1d' })
    
}


//login
const loginUser= async(req,res)=>{
    const{email,password}= req.body
    try{
        const user = await User.login(email,password)
        //create token
        const token = createToken(user._id)
        const refresh = refreshToken(user._id)
         res.cookie('jwt', refreshToken, {
            httpOnly: true, //accessible only by web server 
            secure: true, //https
          //  sameSite: 'None', //cross-site cookie 
            maxAge: 7 * 24 * 60 * 60 * 1000 //cookie expiry: set to match rT
        }) 


        res.status(200).json({email, token,refresh})
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
const refresh = (req, res) => {
    const cookies = req.cookies

    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' })

    const refreshToken = cookies.jwt

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        asyncHandler(async (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })

            const foundUser = await User.findOne({ email: decoded.email }).exec()

            if (!foundUser) return res.status(401).json({ message: 'Unauthorized' })

            const accessToken = jwt.sign(
                {_id}, process.env.SECRET, {expiresIn: '10m'}
            )

            res.json({ accessToken })
        })
    )
}
// end refresh
//logout
// @desc Logout
// @route POST /auth/logout
// @access Public - just to clear cookie if exists
const logout = (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204) //No content
    res.clearCookie('jwt', { httpOnly: true, secure: true })
    res.json({ message: 'Cookie cleared' })
}
//end logout
/* const refresh=async(req,res)=> {
    const token = req.headers['x-access-token'] || req.headers['authorization'];  
    if (!token) {return res.status(403).send({auth: false, message: 'No token provided.'});}

    let decoded;
    try{
       decoded = jwt.verify(token.split(' ')[1], process.env.SECRET);
       const user = await User.findById(decoded.id)  
       const newToken = createToken(user._id, true)  
       res.header("Authorization", newToken).send(newToken);  
    } catch (err) { 
      console.log(err); 
      res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });  
    }   
}
 */
/* 
module.exports= {
    loginUser, 
    signupUser,
    refresh,
    logout
}
     */






const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const { sendResetPasswordEmail } = require('../routes/utils/mailer');
const crypto = require('crypto'); // Pour générer un token sécurisé

// @desc Login
// @route POST /auth
// @access Public
const login = asyncHandler(async(req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const foundUser = await User.findOne({ email }).exec()

    if (!foundUser) {
        return res.status(401).json({ message: 'Unauthorized' })
    }
    if (!foundUser.active) {
        return res.status(403).json({ message: 'This account has been deactivated by the adminstrator' })
    }

    const match = await bcrypt.compare(password, foundUser.password)

    if (!match) return res.status(401).json({ message: 'Unauthorized' })

    const accessToken = jwt.sign({
            "UserInfo": {
                "email": foundUser.email,
                "roles": foundUser.roles
            }
        },
        process.env.SECRET, { expiresIn: '15m' }
    )

    const refreshToken = jwt.sign({ "email": foundUser.email },
        process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' }
    )

    // Create secure cookie with refresh token 
    res.cookie('jwt', refreshToken, {
        httpOnly: true, //accessible only by web server 
        secure: true, //https
        //cross-site cookie 
        maxAge: 7 * 24 * 60 * 60 * 1000 //cookie expiry: set to match rT
    })

    // Send accessToken containing username and roles 
    res.json({ accessToken })
})

// @desc Refresh
// @route GET /auth/refresh
// @access Public - because access token has expired
const refresh = (req, res) => {
    const cookies = req.cookies

    if (!cookies.jwt) return res.status(401).json({ message: 'Unauthorized' })

    const refreshToken = cookies.jwt

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        asyncHandler(async(err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })

            const foundUser = await User.findOne({ email: decoded.email }).exec()

            if (!foundUser) return res.status(401).json({ message: 'Unauthorized' })

            const accessToken = jwt.sign({
                    "UserInfo": {
                        "email": foundUser.email,
                        "roles": foundUser.roles
                    }
                },
                process.env.SECRET, { expiresIn: '15m' }
            )

            res.json({ accessToken })
        })
    )
}

// @desc Logout
// @route POST /auth/logout
// @access Public - just to clear cookie if exists
const logout = (req, res) => {
    const cookies = req.cookies
    if (!cookies.jwt) return res.sendStatus(204) //No content
    res.clearCookie('jwt', { httpOnly: true, secure: true })
    res.json({ message: 'Cookie cleared' })
}
const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '10  m' })

}

//sign up
const signupUser = async(req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.signup(email, password)

        //create token
        const token = createToken(user._id)
        const foundUser = await User.findOne({ email }).exec()


        const refreshToken = jwt.sign({ "email": foundUser.email },
            process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' }
        )

        // Create secure cookie with refresh token 
        res.cookie('jwt', refreshToken, {
            httpOnly: true, //accessible only by web server 
            secure: true, //https
            //cross-site cookie 
            maxAge: 7 * 24 * 60 * 60 * 1000 //cookie expiry: set to match rT
        })

        res.status(200).json({ email, token })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }

}

// Method to handle forgot password logic
/* const forgotPassword = async(req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'Aucun utilisateur trouvé avec cet email.' });
        }

        // Générer un token de réinitialisation et sa date d'expiration
        const resetPasswordToken = crypto.randomBytes(20).toString('hex');
        const resetPasswordExpires = Date.now() + 3600000; // 1 heure à partir de maintenant

        user.resetPasswordToken = resetPasswordToken;
        user.resetPasswordExpires = resetPasswordExpires;
        await user.save();

        // Générer le lien de réinitialisation
        const resetLink = `http://localhost:5173/reset-password/${resetPasswordToken}`;

        // Envoyer l'email de réinitialisation
        await sendResetPasswordEmail(user.email, resetLink);
        res.json({ message: 'Un email de réinitialisation a été envoyé.' });

    } catch (error) {
        console.error("Erreur lors de la réinitialisation du mot de passe", error);
        res.status(500).json({ message: "Erreur lors de l'envoi de l'email de réinitialisation." });
    }
};
 */
const forgotPassword = async(req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'Aucun utilisateur trouvé avec cet email.' });
        }

        // Générer un token de réinitialisation et sa date d'expiration
        const resetPasswordToken = crypto.randomBytes(20).toString('hex');
        const resetPasswordExpires = Date.now() + 3600000; // 1 heure à partir de maintenant

        user.resetPasswordToken = resetPasswordToken;
        user.resetPasswordExpires = resetPasswordExpires;
        await user.save();

        // Générer le lien de réinitialisation
        const resetLink = `http://localhost:5173/reset-password/${resetPasswordToken}`;

        // Inclure le token et le lien dans la réponse JSON au lieu d'envoyer un email
        res.json({
            message: 'Un email de réinitialisation aurait été envoyé.',
            token: resetPasswordToken, // Inclus pour les besoins du test
            link: resetLink // Inclus pour les besoins du test
        });

    } catch (error) {
        console.error("Erreur lors de la réinitialisation du mot de passe", error);
        res.status(500).json({ message: "Erreur lors de l'envoi de l'email de réinitialisation." });
    }
};



// Method to handle reset password logic
const resetPassword = async(req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        return res.status(400).json({ message: 'Token et nouveau mot de passe sont requis.' });
    }

    try {
        // Trouver l'utilisateur par le token de réinitialisation et s'assurer que le token n'a pas expiré
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() } // $gt signifie "greater than", donc vérifie si la date d'expiration est supérieure à maintenant
        });

        if (!user) {
            return res.status(400).json({ message: "Token invalide ou expiré." });
        }

        // Hasher le nouveau mot de passe
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Mettre à jour le mot de passe de l'utilisateur dans la base de données et effacer les champs du token de réinitialisation
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        // Envoyer une réponse de succès
        res.json({ message: "Mot de passe réinitialisé avec succès." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur du serveur." });
    }
};


module.exports = {
    login,
    refresh,
    logout,
    signupUser,
    forgotPassword,
    resetPassword
}